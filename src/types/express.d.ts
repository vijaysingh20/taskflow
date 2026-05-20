import { AccessTokenPayload } from '@/features/auth/auth.token';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
