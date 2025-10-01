// src/dtos/auth.dtos.js
// Langkah 1: Impor seluruh 'kotak peralatan' dan beri nama, misalnya 'validator'
import validator from 'validator';

// Langkah 2: Buka 'kotak' itu dan ambil alat yang Anda butuhkan (isEmail)
const { isEmail } = validator;
import { BadRequestError } from '../../errors/index.js';

// ===================================
// REQUEST DTOs
// ===================================

/**
 * DTO for user registration request.
 */
export class RegisterRequestDto {
  constructor({ email, username, password }) {
    if (!email || !username || !password) {
      throw new BadRequestError('Email, username, and password are required.');
    }
    if (!isEmail(email)) {
      throw new BadRequestError('Invalid email format.');
    }
    this.email = email.trim().toLowerCase();
    this.username = username.trim().toLowerCase();
    this.password = password;
  }
}

/**
 * DTO for user login request.
 */
export class LoginRequestDto {
  constructor({ identifier,email,username, password }) {
    const id = identifier || email || username;
    if (!id || !password) {
      throw new BadRequestError('Identifier and password are required.');
    }
    this.identifier = id.trim().toLowerCase();
    this.password = password;
  }
}

/**
 * DTO for email verification request.
 */
export class VerifyEmailRequestDto {
  constructor({ verificationToken, email }) {
    if (!verificationToken || !email) {
      throw new BadRequestError('Token and email are required.');
    }
    if (!isEmail(email)) {
      throw new Error('Invalid email format.');
    }
    this.verificationToken = verificationToken;
    this.email = email;
  }
}

/**
 * DTO for forgot password request.
 */
export class ForgotPasswordRequestDto {
  constructor({ email }) {
    if (!email) {
      throw new BadRequestError('Email is required.');
    }
    if (!isEmail(email)) {
      throw new BadRequestError('Invalid email format.');
    }
    this.email = email;
  }
}

/**
 * DTO for reset password request.
 */
export class ResetPasswordRequestDto {
  constructor({ token, newPassword }) {
    if (!token || !newPassword) {
      throw new BadRequestError('Token and new password are required.');
    }
    this.token = token;
    this.newPassword = newPassword;
  }
}

/**
 * DTO for Google login request.
 */
export class GoogleLoginRequestDto {
  constructor({ tokenId }) {
    if (!tokenId) {
      throw new BadRequestError('tokenId is required.');
    }
    this.tokenId = tokenId;
  }
}

/**
 * DTO for updating user information.
 */
export class UpdateUserRequestDto {
  constructor({ username, oldPassword, newPassword }) {
    // Allows partial updates, so no properties are strictly required.
    this.username = username?.trim().toLowerCase();
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}

// ===================================
// RESPONSE DTOs
// ===================================

/**
 * DTO for user data returned in a response.
 */
export class UserResponseDto {
  constructor(user) {
    this.id = user.id;
    this.token= user.token;
    this.username = user.username;
    this.email = user.email;
  }
}

/**
 * DTO for login response.
 */
// src/dtos/auth.dtos.js
export class LoginResponseDto {
  constructor(token, user) {
    this.accessToken = token; // nama harus sesuai frontend
    this.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
/**
 * DTO for general success message response.
 */
export class MessageResponseDto {
  constructor(message) {
    this.message = message;
  }
}

export class CheckEmailDto {
  constructor(email) {
       if (!email) throw new BadRequestError('Email is required');
    this.email = email.trim().toLowerCase();
  }
}

export class CheckUsernameDto {
  constructor(username) {
        if (!username) throw new BadRequestError('Username is required');
        this.username = username.trim().toLowerCase();
  }
}