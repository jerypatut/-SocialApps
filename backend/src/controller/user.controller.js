import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  UnauthorizedError 
} from '../errors/index.js';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  getUserData,
  updateUserData,
  logoutUser,
  checkEmail,
  checkUsername,
  deleteUser
} from '../services/user.service.js';

import {
  RegisterRequestDto,
  LoginRequestDto,
  VerifyEmailRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  GoogleLoginRequestDto,
  UpdateUserRequestDto,
  UserResponseDto,
  MessageResponseDto,
  LoginResponseDto,
} from '../dtos/user/user.req.dto.js';

// ======= Controller =======

export const UsersRegister = async (req, res, next) => {
  try {
    const registerData = new RegisterRequestDto(req.body);
    await registerUser(registerData);
    return res.status(StatusCodes.CREATED)
              .json(new MessageResponseDto('User registered. Please check your email to verify account.'));
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req, res, next) => {
  try {
    const verifyData = new VerifyEmailRequestDto(req.body);
    await verifyEmail(verifyData);
    return res.status(StatusCodes.OK)
              .json(new MessageResponseDto('Email verified successfully. You can now login.'));
  } catch (error) {
    next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const loginData = new LoginRequestDto(req.body);
    const { accessToken, user } = await loginUser(loginData);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000
    });
    return res.status(StatusCodes.OK).json(new LoginResponseDto(accessToken, user));
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    const forgotPasswordData = new ForgotPasswordRequestDto(req.body);
    await forgotPassword(forgotPasswordData);
    return res.status(StatusCodes.OK)
              .json(new MessageResponseDto('Password reset link sent to your email'));
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const resetPasswordData = new ResetPasswordRequestDto(req.body);
    await resetPassword(resetPasswordData);
    return res.status(StatusCodes.OK)
              .json(new MessageResponseDto('Password has been reset. You can now login.'));
  } catch (error) {
    next(error);
  }
};

export const googleLoginController = async (req, res, next) => {
  try {
    const googleLoginData = new GoogleLoginRequestDto(req.body);
    const { token, user } = await googleLogin(googleLoginData);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000
    });

    return res.status(StatusCodes.OK).json({
      ...new LoginResponseDto(token, user),
      message: user.createdAt === user.updatedAt ? 'Registered via Google' : 'Logged in via Google'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });

  try {
    const user = await getUserData(token);
    return res.status(StatusCodes.OK).json(new UserResponseDto(user));
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });

  try {
    const updateData = new UpdateUserRequestDto(req.body);
    await updateUserData(token, updateData);
    return res.status(StatusCodes.OK).json(new MessageResponseDto('User updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    await logoutUser(token);

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res.status(StatusCodes.OK).json(new MessageResponseDto('Logged out successfully'));
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

export const checkEmailController = async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Email wajib diisi' });

    const exists = await checkEmail(email);
    return res.status(200).json({ exists }); // true / false
  } catch (error) {
    next(error);
  }
};

export const checkUsernameController = async (req, res, next) => {
  try {
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: 'Username wajib diisi' });

    const exists = await checkUsername(username);
    return res.status(200).json({ exists }); // true / false
  } catch (error) {
    next(error);
  }
};


export const deleteUserController = async (req, res, next) => {
  try {
    const user = await deleteUser(req.user.id);
    res.clearCookie("token")
    return res.status(StatusCodes.OK).json({ message: 'User deleted successfully', user });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};
