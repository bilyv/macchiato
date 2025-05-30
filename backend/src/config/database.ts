import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration for Render deployment
const getDatabaseConfig = () => {
  // Check if we have a DATABASE_URL (Render provides this)
  if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL for connection');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
      }
    };
  }

  // Fallback to individual environment variables for local development
  console.log('Using individual environment variables for connection');
  return {
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    database: process.env.PGDATABASE || 'macchiato_3xko',
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  };
};

// Create a connection pool with dynamic configuration
const pool = new Pool(getDatabaseConfig());

// Enhanced connection testing with better error handling
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    console.log('✅ Connected to PostgreSQL database at:', result.rows[0].now);
    console.log(`✅ Database: ${process.env.PGDATABASE || 'macchiato_3xko'}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);

    return true;
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL database:', err);
    console.error('Connection details:', {
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      port: process.env.PGPORT,
      hasPassword: !!process.env.PGPASSWORD,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    });
    return false;
  }
};

// Test connection on startup
testConnection();

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
