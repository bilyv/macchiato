import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
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
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError('Error fetching contact messages', 500);
    }

    res.status(200).json({
      status: 'success',
      results: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get contact message by ID (admin only)
export const getMessageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Message not found', 404);
      }
      throw new AppError('Error fetching message', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Create new contact message (public)
export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const messageData = contactSchema.parse(req.body);

    // Insert message into database
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert({
        ...messageData,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      throw new AppError('Error submitting contact message', 500);
    }

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read (admin only)
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Update message in database
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Error updating message', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Delete message (admin only)
export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Delete message from database
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError('Error deleting message', 500);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
