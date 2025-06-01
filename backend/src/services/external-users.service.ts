import bcrypt from 'bcrypt';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export interface ExternalUser {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExternalUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdBy: string;
}

export interface UpdateExternalUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface ExternalUserCredentials {
  email: string;
  password: string;
}

/**
 * Get all external users
 */
export const getAllExternalUsers = async (): Promise<ExternalUser[]> => {
  try {
    const result = await query(`
      SELECT
        eu.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM external_users eu
      LEFT JOIN users u ON eu.created_by = u.id
      ORDER BY eu.created_at DESC
    `);

    return result.rows;
  } catch (error) {
    console.error('Error fetching external users:', error);
    throw new AppError('Error fetching external users', 500);
  }
};

/**
 * Get external user by ID
 */
export const getExternalUserById = async (id: string): Promise<ExternalUser> => {
  try {
    const result = await query(`
      SELECT
        eu.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM external_users eu
      LEFT JOIN users u ON eu.created_by = u.id
      WHERE eu.id = $1
    `, [id]);

    if (result.rowCount === 0) {
      throw new AppError('External user not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error fetching external user:', error);
    throw new AppError('Error fetching external user', 500);
  }
};

/**
 * Get external user by email
 */
export const getExternalUserByEmail = async (email: string): Promise<ExternalUser | null> => {
  try {
    const result = await query(`
      SELECT * FROM external_users
      WHERE email = $1 AND is_active = true
    `, [email]);

    return result.rowCount > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching external user by email:', error);
    throw new AppError('Error fetching external user', 500);
  }
};

/**
 * Create a new external user
 */
export const createExternalUser = async (userData: CreateExternalUserData): Promise<ExternalUser> => {
  try {
    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM external_users WHERE email = $1',
      [userData.email]
    );

    if (existingUser.rowCount > 0) {
      throw new AppError('Email already exists', 409);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Insert new external user
    const result = await query(`
      INSERT INTO external_users (
        email, password, first_name, last_name, created_by
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.createdBy
    ]);

    return result.rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error creating external user:', error);
    throw new AppError('Error creating external user', 500);
  }
};

/**
 * Update external user
 */
export const updateExternalUser = async (id: string, userData: UpdateExternalUserData): Promise<ExternalUser> => {
  try {
    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      values.push(userData.email);
      paramCount++;
    }

    if (userData.firstName !== undefined) {
      updateFields.push(`first_name = $${paramCount}`);
      values.push(userData.firstName);
      paramCount++;
    }

    if (userData.lastName !== undefined) {
      updateFields.push(`last_name = $${paramCount}`);
      values.push(userData.lastName);
      paramCount++;
    }

    if (userData.isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount}`);
      values.push(userData.isActive);
      paramCount++;
    }

    if (updateFields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    // Add updated_at field
    updateFields.push(`updated_at = NOW()`);

    // Add ID parameter
    values.push(id);

    const result = await query(`
      UPDATE external_users
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rowCount === 0) {
      throw new AppError('External user not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error updating external user:', error);
    throw new AppError('Error updating external user', 500);
  }
};

/**
 * Delete external user
 */
export const deleteExternalUser = async (id: string): Promise<void> => {
  try {
    const result = await query(
      'DELETE FROM external_users WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('External user not found', 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error deleting external user:', error);
    throw new AppError('Error deleting external user', 500);
  }
};

/**
 * Login external user
 */
export const loginExternalUser = async (credentials: ExternalUserCredentials): Promise<ExternalUser> => {
  try {
    const { email, password } = credentials;

    // Get user by email
    const result = await query(`
      SELECT * FROM external_users
      WHERE email = $1 AND is_active = true
    `, [email]);

    if (result.rowCount === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error logging in external user:', error);
    throw new AppError('Login failed', 500);
  }
};
