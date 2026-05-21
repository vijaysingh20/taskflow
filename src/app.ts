import express, { Application, NextFunction, Request, Response } from 'express';
import authRouter from './features/auth/auth.routes';
import { errorHandler } from './shared/middleware/errorHandler';
import workspaceRouter from './features/workspace/workspace.routes';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workspaces', workspaceRouter);

app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
  });
});
app.use(errorHandler);

export default app;
