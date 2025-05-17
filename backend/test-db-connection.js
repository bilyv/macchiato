// Simple script to test PostgreSQL connection
import pg from 'pg';
const { Pool } = pg;

// Create a connection pool with explicit credentials
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'hotel',
  password: '7878',
  port: 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
    console.log('Connection successful!');
  }

  // Close the pool
  pool.end();
});
