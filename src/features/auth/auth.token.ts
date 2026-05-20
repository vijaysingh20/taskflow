import jwt from 'jsonwebtoken';
import { config } from '@/config';

type Expiry = NonNullable<jwt.SignOptions['expiresIn']>;

interface AccessTokenPayload {
  userId: string;
  email: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as unknown as Expiry,
  });

export const generateRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as unknown as Expiry,
  });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, config.JWT_REFRESH_SECRET) as RefreshTokenPayload;
