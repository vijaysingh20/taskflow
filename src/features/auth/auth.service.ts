import bcrypt from 'bcryptjs';
import { type RegisterDto, type LoginDto, RefreshDto } from '@/features/auth/auth.schema';
import { AppError } from '@/shared/errors/AppError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './auth.token';
import { userRepository } from './auth.repository';

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export async function registerUser(userRegister: RegisterDto) {
  const { name, email, password } = userRegister;

  const existing = await userRepository.findUserByEmail(email);
  if (existing) throw new AppError('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userRepository.createUser({
    name,
    email,
    passwordHash: hashedPassword,
  });
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });
  await userRepository.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });
  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function loginUser(userLogin: LoginDto) {
  const { email, password } = userLogin;

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });
  await userRepository.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function refreshToken(tokenRefresh: RefreshDto) {
  const { refreshToken } = tokenRefresh;
  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
  const storedToken = await userRepository.findRefreshToken(refreshToken);
  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const { user } = storedToken;
  const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
  const newRefreshToken = generateRefreshToken({ userId: user.id });

  await userRepository.deleteRefreshToken(storedToken.id);
  await userRepository.createRefreshToken({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function logoutUser(refreshToken: string) {
  await userRepository.deleteRefreshTokenByValue(refreshToken);
  return { message: 'Logged out successfully' };
}
