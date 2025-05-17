import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const notificationBarSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['info', 'warning', 'success', 'error']).default('info'),
  is_active: z.boolean().default(true),
  start_date: z.string().optional().transform(val => val === '' ? null : val),
  end_date: z.string().optional().transform(val => val === '' ? null : val)
});

// Get all notification bars
export const getAllNotificationBars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { active_only } = req.query;

    let sql = 'SELECT * FROM notification_bars';
    const params: any[] = [];

    if (active_only === 'true') {
      sql += ` WHERE is_active = true
              AND (start_date IS NULL OR start_date <= NOW())
              AND (end_date IS NULL OR end_date >= NOW())`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    res.status(200).json({
      status: 'success',
      results: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(new AppError('Error fetching notification bars', 500));
  }
};

// Get notification bar by ID
export const getNotificationBarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM notification_bars WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return next(new AppError('Notification bar not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    next(new AppError('Error fetching notification bar', 500));
  }
};

// Create notification bar
export const createNotificationBar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Received notification bar creation request:', req.body);

    // Validate request body
    const notificationData = notificationBarSchema.parse(req.body);
    const { message, type, is_active, start_date, end_date } = notificationData;

    console.log('Validated notification data:', notificationData);

    // Insert notification bar into database
    const result = await query(
      `INSERT INTO notification_bars (
        message, type, is_active, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        message,
        type,
        is_active,
        start_date || null,
        end_date || null
      ]
    );

    console.log('Notification bar created successfully:', result.rows[0]);

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating notification bar:', error);

    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.errors);
      next(new AppError(`Validation error: ${error.errors[0].message}`, 400));
    } else {
      next(new AppError(`Error creating notification bar: ${error instanceof Error ? error.message : 'Unknown error'}`, 500));
    }
  }
};

// Update notification bar
export const updateNotificationBar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request body
    const notificationData = notificationBarSchema.parse(req.body);
    const { message, type, is_active, start_date, end_date } = notificationData;

    // Update notification bar in database
    const result = await query(
      `UPDATE notification_bars
       SET message = $1, type = $2, is_active = $3, start_date = $4, end_date = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        message,
        type,
        is_active,
        start_date || null,
        end_date || null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return next(new AppError('Notification bar not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(`Validation error: ${error.errors[0].message}`, 400));
    } else {
      next(new AppError('Error updating notification bar', 500));
    }
  }
};

// Delete notification bar
export const deleteNotificationBar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM notification_bars WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return next(new AppError('Notification bar not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Notification bar deleted successfully'
    });
  } catch (error) {
    next(new AppError('Error deleting notification bar', 500));
  }
};
