import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');

async function applyMigrations() {
  console.log('Applying database migrations...');
  
  try {
    // Check if the migrations table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
      );
    `);
    
    // Create migrations table if it doesn't exist
    if (!tableExists.rows[0].exists) {
      console.log('Creating migrations table...');
      await query(`
        CREATE TABLE migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    }
    
    // Get list of applied migrations
    const appliedMigrations = await query('SELECT name FROM migrations');
    const appliedMigrationNames = appliedMigrations.rows.map(row => row.name);
    
    // Read migration files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations are applied in order
    
    // Apply migrations that haven't been applied yet
    for (const file of migrationFiles) {
      if (!appliedMigrationNames.includes(file)) {
        console.log(`Applying migration: ${file}`);
        
        const migrationPath = path.join(migrationsDir, file);
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');
        
        // Apply migration
        await query(migrationSql);
        
        // Record migration as applied
        await query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        
        console.log(`Migration applied: ${file}`);
      } else {
        console.log(`Migration already applied: ${file}`);
      }
    }
    
    console.log('All migrations applied successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
}

// Run migrations
applyMigrations();
