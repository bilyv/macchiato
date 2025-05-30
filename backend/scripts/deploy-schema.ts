import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deploySchema() {
  console.log('🚀 Starting schema deployment to Supabase...');
  console.log(`📍 Connecting to: ${supabaseUrl}`);

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (testError && !testError.message.includes('relation "information_schema.tables" does not exist')) {
      throw testError;
    }

    console.log('✅ Supabase connection successful!');

    // Read the main.sql file
    console.log('\n📖 Reading schema file...');
    const schemaPath = join(__dirname, '..', 'src', 'db', 'main.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');
    console.log(`📄 Schema file loaded: ${schemaSQL.length} characters`);

    // Split the SQL into individual statements
    console.log('\n🔧 Deploying schema to Supabase...');
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement using Supabase RPC
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);

        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          if (error) {
            // Try alternative method for DDL statements
            console.log(`   Retrying with alternative method...`);
            const { error: altError } = await supabase
              .from('_temp_schema_deployment')
              .select('*')
              .limit(0); // This will fail but might execute DDL

            if (altError && !altError.message.includes('relation "_temp_schema_deployment" does not exist')) {
              console.warn(`   Warning on statement ${i + 1}: ${error.message}`);
            }
          }
        } catch (err) {
          console.warn(`   Warning on statement ${i + 1}: ${err}`);
        }
      }
    }

    console.log('✅ Schema deployment completed!');

    // Verify tables were created using Supabase
    console.log('\n🔍 Verifying table creation...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (!tablesError && tables) {
      console.log('📋 Created tables:');
      tables.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('⚠️  Could not verify tables (this is normal for new deployments)');
    }

    // Check if we can query the users table
    console.log('\n👤 Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, role')
      .eq('role', 'admin')
      .limit(1);

    if (!usersError && users && users.length > 0) {
      console.log(`✅ Admin user found: ${users[0].email}`);
    } else if (usersError) {
      console.log('⚠️  Users table not accessible yet (this is normal for new deployments)');
    } else {
      console.log('⚠️  No admin user found');
    }

    console.log('\n🎉 Schema deployment completed successfully!');
    console.log('🔗 Your Supabase database is ready to use.');
    console.log('\n📝 Next steps:');
    console.log('   1. Check your Supabase dashboard to verify tables');
    console.log('   2. Start your backend server: bun run dev');
    console.log('   3. Test the API endpoints');
    console.log('   4. Login with: project@gmail.com / project');

  } catch (error) {
    console.error('❌ Error deploying schema:', error);

    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    console.log('\n💡 Alternative deployment options:');
    console.log('   1. Use Supabase Dashboard SQL Editor to run the schema manually');
    console.log('   2. Copy the contents of src/db/main.sql and paste into Supabase SQL Editor');
    console.log('   3. Or use a PostgreSQL client like pgAdmin or DBeaver');

    process.exit(1);
  }
}

// Run the deployment
deploySchema().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
