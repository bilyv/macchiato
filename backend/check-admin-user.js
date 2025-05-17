// Script to check if the admin user exists
import pg from 'pg';
const { Pool } = pg;

// Database connection configuration
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'hotel',
  password: '7878',
  port: 5432,
});

// Function to check admin user
const checkAdminUser = async () => {
  try {
    // Query to check if admin user exists
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE email = $1',
      ['boss@gmail.com']
    );
    
    if (result.rowCount === 0) {
      console.log('Admin user not found.');
    } else {
      const user = result.rows[0];
      console.log('Admin user found:');
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.first_name} ${user.last_name}`);
      console.log(`Role: ${user.role}`);
      console.log(`Created at: ${user.created_at}`);
    }
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    // Close pool
    pool.end();
  }
};

// Execute the function
checkAdminUser();
