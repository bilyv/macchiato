import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  // If it's our custom AppError, use its status code and message
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors (e.g., from Zod)
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    stack,
    timestamp: new Date().toISOString()
  });
};
