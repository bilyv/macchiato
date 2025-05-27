import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render database configuration
const renderConfig = {
  connectionString: 'postgresql://db_oj3k_user:VqXsUAWlPtmDoLTWL4IpX7k4rZdr3cgr@dpg-d0qaen3uibrs73eep700-a.oregon-postgres.render.com/db_oj3k',
  ssl: {
    rejectUnauthorized: false
  }
};

async function migrateToRender() {
  const client = new Client(renderConfig);
  
  try {
    console.log('🔗 Connecting to Render PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Read the main.sql file
    const sqlFilePath = path.join(__dirname, 'src', 'db', 'main.sql');
    console.log('📖 Reading main.sql file...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('🚀 Executing database schema migration...');
    
    // Execute the SQL content
    await client.query(sqlContent);
    
    console.log('✅ Database migration completed successfully!');
    console.log('');
    console.log('📊 Migration Summary:');
    console.log('- ✅ Extensions created');
    console.log('- ✅ Functions and triggers created');
    console.log('- ✅ All tables created:');
    console.log('  • users (with default admin user)');
    console.log('  • rooms');
    console.log('  • contact_messages');
    console.log('  • gallery_images');
    console.log('  • notification_bars');
    console.log('  • menu_items');
    console.log('  • menu_images');
    console.log('- ✅ Indexes created');
    console.log('- ✅ Default admin user inserted');
    console.log('');
    console.log('🔐 Default Admin Credentials:');
    console.log('📧 Email: project@gmail.com');
    console.log('🔑 Password: project');
    console.log('👤 Role: admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change these credentials in production!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Provide more specific error information
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.detail) {
      console.error('Error Detail:', error.detail);
    }
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the migration
console.log('🏗️  Starting Render Database Migration...');
console.log('🎯 Target: Render PostgreSQL');
console.log('📁 Source: main.sql');
console.log('');

migrateToRender();
