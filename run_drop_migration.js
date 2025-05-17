// Script to run the drop_page_content.sql migration
import { query } from './backend/src/config/database.js';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('Running migration to drop page_contents table...');

    // Read the SQL file
    const sqlPath = path.join('backend/src/db/migrations/drop_page_content.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await query(sql);

    console.log('Successfully dropped page_contents table and related objects');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();
