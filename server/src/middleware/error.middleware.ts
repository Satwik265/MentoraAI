import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.ts';
import { errorResponse } from '../utils/response.ts';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error(`Error processing ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    name: err.name,
    code: err.code,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e: any) => e.message);
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Validation failed', details));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res
      .status(409)
      .json(errorResponse('CONFLICT_ERROR', `A record with this ${field} already exists`));
  }

  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json(errorResponse('INVALID_ID', `Invalid identifier format: ${err.value}`));
  }

  // Generic 500 error without exposing stack trace
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return res.status(statusCode).json(errorResponse('INTERNAL_SERVER_ERROR', message));
}
