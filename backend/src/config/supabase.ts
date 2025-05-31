import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (for Node.js environments)
if (typeof process !== 'undefined' && process.env) {
  dotenv.config();
}

// Function to create Supabase client with environment variables
export const createSupabaseClient = (env?: any) => {
  // For Cloudflare Workers, use env parameter; for Node.js, use process.env
  const supabaseUrl = env?.SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = env?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // We'll handle auth manually for server-side
    },
    db: {
      schema: 'public',
    },
  });
};

// Default Supabase client for Node.js environments
export const supabase = createSupabaseClient();

// Database configuration for direct PostgreSQL connections (for migrations, etc.)
export const dbConfig = {
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase connections
  },
};

// Helper function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
};

export default supabase;
