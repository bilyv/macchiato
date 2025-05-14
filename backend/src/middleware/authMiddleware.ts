import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// Middleware to protect routes that require authentication
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      ) as jwt.JwtPayload;

      // Add user to request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      throw new ApiError(401, 'Not authorized, token failed');
    }
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }
};

// Middleware to restrict access to specific roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Not authorized to access this resource');
    }

    next();
  };
};

export default {
  protect,
  restrictTo
};
