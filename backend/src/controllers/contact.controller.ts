import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional()
});

// Get all contact messages (admin only)
export const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    res.status(200).json({
      status: 'success',
      results: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(new AppError('Error fetching contact messages', 500));
  }
};

// Get contact message by ID (admin only)
export const getMessageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Message not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching message', 500));
    }
  }
};

// Create new contact message (public)
export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const messageData = contactSchema.parse(req.body);

    // Insert message into database
    const result = await query(
      `INSERT INTO contact_messages (
        name, email, subject, message, phone, is_read
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        messageData.name,
        messageData.email,
        messageData.subject,
        messageData.message,
        messageData.phone || null,
        false
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else {
      next(new AppError('Error submitting contact message', 500));
    }
  }
};

// Mark message as read (admin only)
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Update message in database
    const result = await query(
      `UPDATE contact_messages
       SET is_read = true, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Message not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error updating message', 500));
    }
  }
};

// Delete message (admin only)
export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Delete message from database
    const result = await query(
      'DELETE FROM contact_messages WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Message not found', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error deleting message', 500));
    }
  }
};
