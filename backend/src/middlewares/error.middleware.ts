import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${req.method} ${req.url} - Error: ${message}`, {
    stack: err.stack,
    details: err.details || null,
  });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
