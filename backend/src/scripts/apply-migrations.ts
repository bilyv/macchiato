import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
// For compiled JS, we need to go back to the source directory
const sourceDir = path.join(__dirname, '..', '..', 'src');
const mainSchemaPath = path.join(sourceDir, 'db', 'main.sql');

/**
 * Split SQL content into individual statements, properly handling multi-line functions and procedures
 * @param sql The SQL content to split
 * @returns Array of SQL statements
 */
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let currentStatement = '';
  let inFunction = false;
  let dollarQuoteTag = '';

  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('--')) {
      continue;
    }

    // Check for dollar-quoted strings (used in functions)
    const dollarQuoteMatch = trimmedLine.match(/\$([^$]*)\$/);
    if (dollarQuoteMatch) {
      if (!inFunction) {
        // Starting a function
        inFunction = true;
        dollarQuoteTag = dollarQuoteMatch[0];
      } else if (trimmedLine.includes(dollarQuoteTag) && dollarQuoteTag) {
        // Ending a function
        inFunction = false;
        dollarQuoteTag = '';
      }
    }

    currentStatement += line + '\n';

    // If we're not in a function and the line ends with semicolon, it's the end of a statement
    if (!inFunction && trimmedLine.endsWith(';')) {
      const statement = currentStatement.trim();
      if (statement) {
        statements.push(statement);
      }
      currentStatement = '';
    }
  }

  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  return statements;
}

/**
 * Apply the main database schema to the Render PostgreSQL database
 * This function deploys the complete schema including tables, functions, triggers, and indexes
 */
async function applyMainSchema(): Promise<void> {
  console.log('🚀 Deploying main database schema to Render PostgreSQL...');

  try {
    // Check if main.sql exists
    if (!fs.existsSync(mainSchemaPath)) {
      throw new Error(`Main schema file not found at: ${mainSchemaPath}`);
    }

    // Read the main schema file
    const mainSchemaSql = fs.readFileSync(mainSchemaPath, 'utf8');
    console.log('📖 Main schema file loaded successfully');

    // Check if any tables already exist
    const tablesExist = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN ('users', 'rooms', 'contact_messages', 'gallery_images', 'notification_bars', 'menu_items', 'menu_images');
    `);

    if (tablesExist.rows.length > 0) {
      console.log('⚠️  Some tables already exist in the database:');
      tablesExist.rows.forEach((row: any) => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('🔄 Proceeding with schema deployment (will skip existing objects)...');
    }

    // Split the schema into individual statements, handling multi-line functions properly
    const statements = splitSqlStatements(mainSchemaSql);

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        await query(statement);
        successCount++;

        // Log progress for major operations
        if (statement.toLowerCase().includes('create table')) {
          const tableName = statement.match(/create table\s+(\w+)/i)?.[1];
          console.log(`✅ Table created: ${tableName}`);
        } else if (statement.toLowerCase().includes('create extension')) {
          const extName = statement.match(/create extension.*"([^"]+)"/i)?.[1];
          console.log(`✅ Extension enabled: ${extName}`);
        } else if (statement.toLowerCase().includes('create trigger')) {
          const triggerName = statement.match(/create trigger\s+(\w+)/i)?.[1];
          console.log(`✅ Trigger created: ${triggerName}`);
        } else if (statement.toLowerCase().includes('create index')) {
          const indexName = statement.match(/create index\s+(\w+)/i)?.[1];
          console.log(`✅ Index created: ${indexName}`);
        }
      } catch (error: any) {
        // Handle expected errors for existing objects
        if (error.message.includes('already exists') ||
            error.message.includes('duplicate key') ||
            error.message.includes('relation') && error.message.includes('already exists')) {
          skipCount++;
          console.log(`⏭️  Skipped (already exists): ${statement.substring(0, 50)}...`);
        } else {
          errorCount++;
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }

    console.log('\n📊 Schema deployment summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n🎉 Main schema deployed successfully to Render PostgreSQL!');
    } else {
      console.log('\n⚠️  Schema deployment completed with some errors. Please review the errors above.');
    }

  } catch (error: any) {
    console.error('❌ Error deploying main schema:', error.message);
    throw error;
  }
}

/**
 * Apply individual migration files from the migrations directory
 */
async function applyMigrations(): Promise<void> {
  console.log('🔄 Applying database migrations...');

  try {
    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.log('📁 No migrations directory found, skipping migration files');
      return;
    }

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
      console.log('📋 Creating migrations table...');
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
    const appliedMigrationNames = appliedMigrations.rows.map((row: any) => row.name);

    // Read migration files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations are applied in order

    if (migrationFiles.length === 0) {
      console.log('📁 No migration files found');
      return;
    }

    // Apply migrations that haven't been applied yet
    for (const file of migrationFiles) {
      if (!appliedMigrationNames.includes(file)) {
        console.log(`🔄 Applying migration: ${file}`);

        const migrationPath = path.join(migrationsDir, file);
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        try {
          // Apply migration
          await query(migrationSql);

          // Record migration as applied
          await query('INSERT INTO migrations (name) VALUES ($1)', [file]);

          console.log(`✅ Migration applied: ${file}`);
        } catch (error: any) {
          console.error(`❌ Error applying migration ${file}:`, error.message);
          throw error;
        }
      } else {
        console.log(`⏭️  Migration already applied: ${file}`);
      }
    }

    console.log('✅ All migrations applied successfully!');
  } catch (error: any) {
    console.error('❌ Error applying migrations:', error);
    throw error;
  }
}

/**
 * Verify that the database schema was deployed correctly
 */
async function verifySchema(): Promise<void> {
  console.log('🔍 Verifying database schema...');

  try {
    // Check that all expected tables exist
    const expectedTables = [
      'users', 'rooms', 'contact_messages', 'gallery_images',
      'notification_bars', 'menu_items', 'menu_images'
    ];

    const existingTables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name = ANY($1);
    `, [expectedTables]);

    const existingTableNames = existingTables.rows.map((row: any) => row.table_name);

    console.log('📋 Table verification:');
    for (const table of expectedTables) {
      if (existingTableNames.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING`);
      }
    }

    // Check for the admin user
    const adminUser = await query(`
      SELECT email, role FROM users WHERE email = 'project@gmail.com' AND role = 'admin'
    `);

    if (adminUser.rows.length > 0) {
      console.log('✅ Default admin user exists');
    } else {
      console.log('⚠️  Default admin user not found');
    }

    // Check extensions
    const extensions = await query(`
      SELECT extname FROM pg_extension WHERE extname = 'uuid-ossp'
    `);

    if (extensions.rows.length > 0) {
      console.log('✅ UUID extension enabled');
    } else {
      console.log('⚠️  UUID extension not found');
    }

    console.log('🎉 Schema verification completed!');

  } catch (error: any) {
    console.error('❌ Error verifying schema:', error.message);
    throw error;
  }
}

/**
 * Main function to deploy the complete database schema
 */
async function deployDatabase(): Promise<void> {
  console.log('🚀 Starting database deployment to Render PostgreSQL...\n');

  try {
    // Step 1: Deploy main schema
    await applyMainSchema();
    console.log('');

    // Step 2: Apply any additional migrations
    await applyMigrations();
    console.log('');

    // Step 3: Verify the deployment
    await verifySchema();
    console.log('');

    console.log('🎉 Database deployment completed successfully!');
    console.log('🔗 Your Render PostgreSQL database is now ready for use.');

  } catch (error: any) {
    console.error('\n❌ Database deployment failed:', error.message);
    process.exit(1);
  }
}

// Run the deployment
deployDatabase();
