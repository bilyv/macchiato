import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a PostgreSQL client
const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hotel',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '7878',
});

async function createGalleryTable() {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database');

    // Read the gallery.sql file
    const gallerySQL = fs.readFileSync(path.join(__dirname, 'src', 'db', 'gallery.sql'), 'utf8');
    
    // Execute the SQL
    await client.query(gallerySQL);
    console.log('Gallery table created successfully');

    // Verify the table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'gallery_images'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('Verified: gallery_images table exists');
    } else {
      console.error('Error: gallery_images table does not exist after creation attempt');
    }

  } catch (error) {
    console.error('Error creating gallery table:', error);
  } finally {
    // Close the connection
    await client.end();
    console.log('Connection closed');
  }
}

// Run the function
createGalleryTable();
