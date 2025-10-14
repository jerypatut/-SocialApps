// src/services/auth.service.js
import db from '../../models/index.js';
const { Users, Posts,Comments,Likes } = db;

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import redisClient from '../controller/redisClient.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { Op, fn, col, where } from 'sequelize';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../errors/index.js';

// ================== Utils ==================
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
  } catch (error) {
    console.warn('Email sending failed:', error.message);
  }
};

// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/auth/google-login'
);

// ================== Services ==================
// Register user
export const registerUser = async ({ email, username, password }) => {
  const existingUser = await Users.findOne({
    where: { [Op.or]: [{ username }, { email }] },
  });
  if (existingUser) throw new BadRequestError('Username or email already exists');

  const hash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const newUser = await Users.create({
    email,
    username,
    password: hash,
    isVerified: false,
    verificationToken,
  });

  const verifyUrl = `http://localhost:3000/user/verify-email?token=${verificationToken}&email=${email}`;
   sendEmail(
    newUser.email,
    'Please verify your email',
    `<p>Hi ${newUser.username},</p><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">Verify Email</a>`
  );

  const plainUser = newUser.toJSON();
  delete plainUser.password;
  delete plainUser.verificationToken;
  return plainUser;
};

// Verify email
export const verifyEmail = async ({ verificationToken, email }) => {
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new BadRequestError('Verification failed, email not found');
  if (!user.verificationToken || user.verificationToken !== verificationToken)
    throw new BadRequestError('Verification failed, invalid token');
  if (user.isVerified) throw new BadRequestError('Email already verified');

  user.isVerified = true;
  user.verificationToken = null;
  user.verified = new Date();
  await user.save();

  const plainUser = user.toJSON();
  delete plainUser.password;
  return plainUser;
};

// Login
export const loginUser = async ({ identifier, password }) => {
  const isEmail = identifier.includes('@');
const user = await Users.findOne({
  where: isEmail
    ? where(fn('LOWER', col('email')), identifier)
    : where(fn('LOWER', col('username')), identifier)
});

  console.log('Login attempt identifier:', identifier);
  if (!user) throw new NotFoundError('User not found');
  if (!user.password) throw new BadRequestError('Password login not available for this account');
  if (!user.isVerified) throw new UnauthorizedError('Please verify your email before login');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new BadRequestError('Invalid password');

  const payload = {
     id: user.id,
     username: user.username,
    email: user.email
   };
   
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  const plainUser = user.toJSON();
  delete plainUser.password;

  try {
    await redisClient.setEx(`user:${user.id}`, 3600, JSON.stringify(plainUser));
  } catch (err) {
    console.warn('Redis set failed:', err.message);
  }

  return { accessToken, user: plainUser };
};
  // Forgot password
export const forgotPassword = async ({ email }) => {
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new NotFoundError('Email not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 3600000);

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();

  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  sendEmail(
    email,
    'Password Reset Request',
    `<p>Hi ${user.username},</p><p>Click the link below to reset your password (valid for 1 hour):</p><a href="${resetUrl}">Reset Password</a>`
  );

  return { message: 'Reset password link sent to email' };
};

// Reset password
export const resetPassword = async ({ token, newPassword }) => {
  const user = await Users.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });
  if (!user) throw new NotFoundError('Invalid or expired token');

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  sendEmail(
    user.email,
    'Password Reset Successful',
    `<p>Hi ${user.username},</p><p>Your password has been successfully reset.</p>`
  );

  const plainUser = user.toJSON();
  delete plainUser.password;
  return plainUser;
};

// Google login / register
export const googleLogin = async ({ tokenId }) => {
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, sub: googleId } = payload;

  let user = await Users.findOne({ where: { email } });

  if (!user){
    // pastikan username unik
    let username = name.replace(/\s/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
    while (await Users.findOne({ where: { username } })) {
      username += Math.floor(Math.random() * 10);
    }
    const hashPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

    user = await Users.create({
      email,
      username,
      password: hashPassword,
      isVerified: true,
      googleId,
    });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const plainUser = user.toJSON();
  delete plainUser.password;

  try {
    await redisClient.setEx(`user:${user.id}`, 3600, JSON.stringify(plainUser));
  } catch (err) {
    console.warn('Redis set failed:', err.message);
  }

  return { token, user: plainUser };
};

// Get user
export const getUserData = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }

  try {
    const cachedUser = await redisClient.get(`user:${decoded.id}`);
    if (cachedUser) return JSON.parse(cachedUser);
  } catch (err) {
    console.warn('Redis get failed:', err.message);
  }

  const user = await Users.findOne({ where: { id: decoded.id } });
  if (!user) throw new NotFoundError('User not found');

  const plainUser = user.toJSON();
  delete plainUser.password;

  try {
    await redisClient.setEx(`user:${decoded.id}`, 3600, JSON.stringify(plainUser));
  } catch (err) {
    console.warn('Redis set failed:', err.message);
  }

  return plainUser;
};

// Update user
// ✅ Update user + sinkron ke semua relasi (Posts, Comments, Likes)
export const updateUserData = async (token, { username, oldPassword, newPassword, name, email }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }

  const user = await Users.findByPk(decoded.id);
  if (!user) throw new NotFoundError('User not found');

  // 🔹 Update username
  let oldUsername = user.username;
  if (username) user.username = username.trim().toLowerCase();

  // 🔹 Update display name (untuk tampilan nama publik)
  if (name) user.name = name.trim();

  // 🔹 Update email
  if (email) user.email = email.trim().toLowerCase();

  // 🔹 Update password
  if (oldPassword && newPassword) {
    if (!user.password) {
      throw new BadRequestError('Password update not available for Google accounts');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestError('Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
  }

  // ✅ Simpan perubahan user
  await user.save();

  // 🔥 Sinkronisasi nama/username ke seluruh relasi
  if (username) {
    try {
      // Update semua postingan user
      await Posts.update(
        { username: user.username },
        { where: { userId: user.id } }
      );

      // Update semua komentar user
      await Comments.update(
        { username: user.username },
        { where: { userId: user.id } }
      );

      // Update semua like user
      await Likes.update(
        { username: user.username },
        { where: { userId: user.id } }
      );
    } catch (err) {
      console.warn('Gagal sinkron relasi posts/comments/likes:', err.message);
    }
  }

  // 🧠 Update cache Redis (biar cepat dibaca ulang)
  const plainUser = user.toJSON();
  delete plainUser.password;
  delete plainUser.verificationToken;
  delete plainUser.resetPasswordToken;

  try {
    await redisClient.setEx(`user:${user.id}`, 3600, JSON.stringify(plainUser));
  } catch (err) {
    console.warn('Redis set failed:', err.message);
  }

  return plainUser;
};

// Logout
export const logoutUser = async (token) => {
  if (!token) return;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return; // token expired atau invalid, tetap anggap logout sukses
  }

  try {
    await redisClient.del(`user:${decoded.id}`);
  } catch (err) {
    console.warn('Redis del failed:', err.message);
  }
};


export const checkEmail = async (email) => {
  const exists = await Users.findOne({ where: { email } });
  return !!exists; // true jika sudah ada, false jika belum
};

export const checkUsername = async (username) => {
  const exists = await Users.findOne({ where: { username } });
  return !!exists; // true jika sudah ada, false jika belum
};


export const deleteUser = async (id) => {
  const user = await Users.findByPk(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  await user.destroy(); // ✅ cascade jalan
  // Hapus cache Redis kalau ada
  try {
    await redisClient.del(`user:${id}`);
  } catch (err) {
    console.warn('Redis del failed:', err.message);
  }
  const plainUser = user.toJSON();
  delete plainUser.password;
  return plainUser; // ✅ return data user yang udah dihapus
};
