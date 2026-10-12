import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response.ts';

export const standardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests, please try again in 15 minutes.'),
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('AUTH_RATE_LIMIT_EXCEEDED', 'Too many authentication attempts, please try again later.'),
});

export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('AI_RATE_LIMIT_EXCEEDED', 'AI request limit reached. Please wait a minute.'),
});
