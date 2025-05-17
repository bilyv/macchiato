import { query, transaction } from '../config/database.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler.js';

// User type definition
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

// Login credentials type
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data type
export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  const { email, password } = credentials;

  // Find user by email
  const result = await query(
    'SELECT id, email, password, first_name, last_name, role FROM users WHERE email = $1',
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};

// Register user
export const registerUser = async (data: RegistrationData): Promise<void> => {
  const { email, password, firstName, lastName } = data;

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rowCount > 0) {
    throw new AppError('Email already in use', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with transaction
  await transaction(async (client) => {
    // Generate UUID for user
    const userId = uuidv4();

    // Insert user into database
    await client.query(
      `INSERT INTO users (
        id, email, password, first_name, last_name, role
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email, hashedPassword, firstName, lastName, 'user']
    );
  });
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const result = await query(
    'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0] as User;
};

export default {
  loginUser,
  registerUser,
  getUserById
};
