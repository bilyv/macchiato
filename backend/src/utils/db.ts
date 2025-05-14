import pool from '../config/database.js';
import type { PoolClient, QueryResult } from 'pg';

// Extend the PoolClient interface to include our custom property
interface ExtendedPoolClient extends PoolClient {
  lastQuery?: any[];
}

/**
 * Execute a SQL query with optional parameters
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result
 */
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns Client from the pool
 */
export const getClient = async (): Promise<ExtendedPoolClient> => {
  const client = await pool.connect() as ExtendedPoolClient;
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${JSON.stringify(client.lastQuery)}`);
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = function(...args: any[]): any {
    client.lastQuery = args;
    return originalQuery.apply(client, args as any);
  };

  client.release = function(): void {
    clearTimeout(timeout);
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease.apply(client);
  };

  return client;
};

/**
 * Execute a transaction with the provided callback
 * @param callback Function that receives a client and executes queries
 * @returns Result of the callback function
 */
export const transaction = async <T>(callback: (client: ExtendedPoolClient) => Promise<T>): Promise<T> => {
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
  transaction
};
