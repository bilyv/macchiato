import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize the database with schema
 */
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Connect to the database
    const client = await pool.connect();
    
    try {
      // Execute the schema SQL
      await client.query(schemaSql);
      console.log('Database initialized successfully');
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  });
}

export default initializeDatabase;
