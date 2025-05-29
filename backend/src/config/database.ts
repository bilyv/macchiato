import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool with hardcoded credentials
// This ensures we're using the exact credentials provided
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
    console.error(`Connection details: host=${process.env.PGHOST}, database=${process.env.PGDATABASE}, user=${process.env.PGUSER}, port=${process.env.PGPORT}`);
  } else {
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
    console.log(`Successfully connected to database: ${process.env.PGDATABASE} on ${process.env.PGHOST}:${process.env.PGPORT}`);
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
