import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again after a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    status: 'error',
    message: 'Upload limit exceeded. Max 5 reports per minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
