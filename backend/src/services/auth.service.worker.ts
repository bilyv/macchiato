import { createSupabaseClient } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

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

// Hash password using Web Crypto API (Workers compatible)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password using Web Crypto API (Workers compatible)
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

// Login user
export const loginUser = async (credentials: LoginCredentials, env?: any): Promise<User> => {
  const { email, password } = credentials;

  // Create Supabase client
  const supabase = createSupabaseClient(env);

  // Find user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password, first_name, last_name, role')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};

// Register user
export const registerUser = async (data: RegistrationData, env?: any): Promise<void> => {
  const { email, password, firstName, lastName } = data;

  // Create Supabase client
  const supabase = createSupabaseClient(env);

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate UUID for user
  const userId = uuidv4();

  // Insert user into database
  const { error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: 'user'
    });

  if (error) {
    throw new Error('Registration failed: ' + error.message);
  }
};

// Get user by ID
export const getUserById = async (id: string, env?: any): Promise<User | null> => {
  // Create Supabase client
  const supabase = createSupabaseClient(env);

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role')
    .eq('id', id)
    .single();

  if (error || !user) {
    return null;
  }

  return user as User;
};

export default {
  loginUser,
  registerUser,
  getUserById
};
