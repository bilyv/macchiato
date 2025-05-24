import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const migrationPath = path.join(__dirname, '../db/migrations/add_category_to_rooms.sql');
  
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Connect to the database
    const client = await pool.connect();
    
    try {
      // Start a transaction
      await client.query('BEGIN');
      
      // Run the migration
      await client.query(migrationSQL);
      
      // Commit the transaction
      await client.query('COMMIT');
      
      console.log('Migration completed successfully!');
    } catch (error) {
      // Rollback the transaction in case of error
      await client.query('ROLLBACK');
      console.error('Error executing migration:', error);
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
runMigration();
