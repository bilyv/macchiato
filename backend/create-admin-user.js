// Script to create a default admin user
import pg from 'pg';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;

// Database connection configuration
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'hotel',
  password: '7878',
  port: 5432,
});

// Admin user details
const adminUser = {
  email: 'boss@gmail.com',
  password: 'boss123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

// Function to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Function to create admin user
const createAdminUser = async () => {
  const client = await pool.connect();
  
  try {
    // Check if user already exists
    const checkResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminUser.email]
    );
    
    if (checkResult.rowCount > 0) {
      console.log(`Admin user with email ${adminUser.email} already exists.`);
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(adminUser.password);
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Generate UUID for user
    const userId = uuidv4();
    
    // Insert user into database
    await client.query(
      `INSERT INTO users (
        id, email, password, first_name, last_name, role
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        adminUser.email,
        hashedPassword,
        adminUser.firstName,
        adminUser.lastName,
        adminUser.role
      ]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`Admin user created successfully with email: ${adminUser.email}`);
    console.log(`User ID: ${userId}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('You can now log in with these credentials.');
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error creating admin user:', error);
  } finally {
    // Release client
    client.release();
    // Close pool
    pool.end();
  }
};

// Execute the function
createAdminUser();
