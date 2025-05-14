import { Request, Response } from 'express';
import { query } from '../config/database.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

// Submit contact form
export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  // Create contact message
  const result = await query(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, subject, message]
  );

  const contactMessage = result.rows[0];

  res.status(201).json({
    success: true,
    data: {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
      message: contactMessage.message,
      isRead: contactMessage.is_read,
      createdAt: contactMessage.created_at
    }
  });
});

// Get all contact messages (admin only)
export const getContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');

  const messages = result.rows.map(message => ({
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    isRead: message.is_read,
    createdAt: message.created_at
  }));

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// Get single contact message (admin only)
export const getContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.id;

  const result = await query('SELECT * FROM contact_messages WHERE id = $1', [messageId]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Message not found');
  }

  const message = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      isRead: message.is_read,
      createdAt: message.created_at
    }
  });
});

// Mark contact message as read (admin only)
export const markMessageAsRead = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.id;

  // Check if message exists
  const messageExists = await query('SELECT * FROM contact_messages WHERE id = $1', [messageId]);
  
  if (messageExists.rows.length === 0) {
    throw new ApiError(404, 'Message not found');
  }

  // Update message
  const result = await query(
    'UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *',
    [messageId]
  );

  const message = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      isRead: message.is_read,
      createdAt: message.created_at
    }
  });
});

// Delete contact message (admin only)
export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const messageId = req.params.id;

  // Check if message exists
  const messageExists = await query('SELECT * FROM contact_messages WHERE id = $1', [messageId]);
  
  if (messageExists.rows.length === 0) {
    throw new ApiError(404, 'Message not found');
  }

  // Delete message
  await query('DELETE FROM contact_messages WHERE id = $1', [messageId]);

  res.status(200).json({
    success: true,
    data: {}
  });
});

export default {
  submitContactForm,
  getContactMessages,
  getContactMessage,
  markMessageAsRead,
  deleteContactMessage
};
