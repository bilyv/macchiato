import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { query } from '../config/database.js';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Invalid token format', 401);
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    // @ts-ignore - Ignoring type issues with jwt.verify
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: string;
    };

    // Check if user exists in database (check both users and external_users tables)
    let user = null;

    // First check in users table (admin users)
    const userResult = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rowCount > 0) {
      user = userResult.rows[0];
    } else {
      // Check in external_users table
      const externalUserResult = await query(
        'SELECT id, email, role FROM external_users WHERE id = $1 AND is_active = true',
        [decoded.id]
      );

      if (externalUserResult.rowCount > 0) {
        user = externalUserResult.rows[0];
      }
    }

    if (!user) {
      throw new AppError('User not found or token invalid', 401);
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const authorizeAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }

  next();
};

export const authorizeExternalUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'external_user') {
    return next(new AppError('External user access required', 403));
  }

  next();
};

export const authorizeAdminOrExternalUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'external_user') {
    return next(new AppError('Admin or external user access required', 403));
  }

  next();
};
