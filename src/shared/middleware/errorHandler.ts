import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    logger.error({ err }, 'Unexpected error occurred');
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
