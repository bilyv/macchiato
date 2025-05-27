import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool for Render PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://db_oj3k_user:VqXsUAWlPtmDoLTWL4IpX7k4rZdr3cgr@dpg-d0qaen3uibrs73eep700-a.oregon-postgres.render.com/db_oj3k',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to Render PostgreSQL database:', err);
    console.error('Please check your DATABASE_URL environment variable or connection string');
  } else {
    console.log('✅ Connected to Render PostgreSQL database at:', res.rows[0].now);
    console.log('🎯 Database: Macchiato Suites on Render');
  }
});

// Helper function to get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

// Helper function to execute a query and release the client
export const query = async (text: string, params: any[] = []): Promise<any> => {
  const client = await getClient();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Helper function to execute a transaction
export const transaction = async (callback: (client: PoolClient) => Promise<any>): Promise<any> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default {
  query,
  getClient,
  transaction,
  pool
};
