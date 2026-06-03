import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendError = (res: Response, message = 'Internal Server Error', statusCode = 500, details: any = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    statusCode,
    ...(details && { details }),
  });
};
