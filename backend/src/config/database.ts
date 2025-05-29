import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool using environment variables or fallback to local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  // Fallback to local configuration if no connection string is provided
  host: process.env.DATABASE_URL ? undefined : (process.env.PGHOST || 'localhost'),
  user: process.env.DATABASE_URL ? undefined : (process.env.PGUSER || 'postgres'),
  database: process.env.DATABASE_URL ? undefined : (process.env.PGDATABASE || 'hotel'),
  password: process.env.DATABASE_URL ? undefined : (process.env.PGPASSWORD || '7878'),
  port: process.env.DATABASE_URL ? undefined : parseInt(process.env.PGPORT || '5432'),
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
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
