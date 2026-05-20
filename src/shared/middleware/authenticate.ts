import { verifyAccessToken } from '@/features/auth/auth.token';
import { AppError } from '../errors/AppError';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Authorization header missing or malformed', 401));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch {
    next(new AppError('Invalid or Expired token', 401));
  }
};
