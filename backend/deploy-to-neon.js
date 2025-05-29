import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Neon.db connection configuration
// You'll need to replace this with your actual Neon.db connection string
const NEON_CONNECTION_STRING = process.env.NEON_DATABASE_URL || 'postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require';

async function deployToNeon() {
  console.log('🚀 Starting deployment to Neon.db...');
  
  // Create connection pool for Neon
  const pool = new Pool({
    connectionString: NEON_CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    console.log('🔗 Testing connection to Neon.db...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Connected to Neon.db at:', testResult.rows[0].now);

    // Read and execute main.sql
    console.log('📄 Reading main.sql schema...');
    const schemaPath = path.join(__dirname, 'src', 'db', 'main.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔧 Applying database schema...');
    await pool.query(schemaSql);
    console.log('✅ Database schema applied successfully!');

    // Verify tables were created
    console.log('🔍 Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📋 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check if admin user was created
    console.log('👤 Checking admin user...');
    const adminResult = await pool.query(
      'SELECT email, first_name, last_name, role FROM users WHERE email = $1',
      ['project@gmail.com']
    );

    if (adminResult.rowCount > 0) {
      const admin = adminResult.rows[0];
      console.log('✅ Admin user created:');
      console.log(`  📧 Email: ${admin.email}`);
      console.log(`  👤 Name: ${admin.first_name} ${admin.last_name}`);
      console.log(`  🔑 Role: ${admin.role}`);
      console.log('  🔐 Password: project');
    } else {
      console.log('❌ Admin user not found');
    }

    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with the Neon connection string');
    console.log('2. Update backend/src/config/database.ts to use environment variables');
    console.log('3. Test your application with the new database');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run deployment
deployToNeon();
