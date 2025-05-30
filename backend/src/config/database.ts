import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { dbConfig, supabase } from './supabase.js';

dotenv.config();

// Create a connection pool using Supabase PostgreSQL configuration
const pool = new Pool({
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  ssl: dbConfig.ssl,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the Supabase connection (non-blocking)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.warn('⚠️  Direct PostgreSQL connection failed, using Supabase client instead');
    console.log('✅ Supabase client is available for database operations');
  } else {
    console.log('✅ Connected to Supabase PostgreSQL database at:', res.rows[0].now);
    console.log(`🚀 Successfully connected to Supabase database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
  }
});

// Helper function to get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

// Helper function to execute a query with fallback to Supabase client
export const query = async (text: string, params: any[] = []): Promise<any> => {
  try {
    // Try direct PostgreSQL connection first
    const client = await getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    console.warn('Direct PostgreSQL query failed, attempting Supabase fallback...');

    // Fallback to Supabase client for common operations
    try {
      return await executeSupabaseQuery(text, params);
    } catch (supabaseError) {
      console.error('Both PostgreSQL and Supabase queries failed:', {
        postgresError: error,
        supabaseError: supabaseError
      });
      throw error; // Throw the original PostgreSQL error
    }
  }
};

// Helper function to execute queries using Supabase client
async function executeSupabaseQuery(text: string, _params: any[] = []): Promise<any> {
  // Convert PostgreSQL query to Supabase query based on common patterns
  const lowerText = text.toLowerCase().trim();

  // Handle SELECT queries
  if (lowerText.startsWith('select')) {
    // Handle user authentication queries
    if (lowerText.includes('from users')) {
      if (lowerText.includes('where email =') && _params.length > 0) {
        // Login query - select user by email
        const { data, error } = await supabase
          .from('users')
          .select('id, email, password, first_name, last_name, role')
          .eq('email', _params[0])
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found
            return { rows: [], rowCount: 0 };
          }
          throw error;
        }
        return { rows: [data], rowCount: 1 };
      }

      if (lowerText.includes('where id =') && _params.length > 0) {
        // Get user by ID (for auth middleware)
        const { data, error } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', _params[0])
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return { rows: [], rowCount: 0 };
          }
          throw error;
        }
        return { rows: [data], rowCount: 1 };
      }
    }

    if (lowerText.includes('from notification_bars')) {
      let query = supabase.from('notification_bars').select('*');

      // Handle active_only filter
      if (lowerText.includes('where is_active = true')) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { rows: data, rowCount: data?.length || 0 };
    }

    if (lowerText.includes('from rooms')) {
      let query = supabase.from('rooms').select('*');

      // Handle specific room queries
      if (lowerText.includes('where room_number =') && _params.length > 0) {
        query = query.eq('room_number', _params[0]);
      }

      const { data, error } = await query.order('room_number', { ascending: true });

      if (error) throw error;
      return { rows: data, rowCount: data?.length || 0 };
    }

    if (lowerText.includes('from menu_items')) {
      let query = supabase.from('menu_items').select('*');

      // Handle category filter
      if (lowerText.includes('where category =') && _params.length > 0) {
        query = query.eq('category', _params[0]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { rows: data, rowCount: data?.length || 0 };
    }

    if (lowerText.includes('from menu_images')) {
      const { data, error } = await supabase
        .from('menu_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { rows: data, rowCount: data?.length || 0 };
    }

    if (lowerText.includes('from contact_messages')) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { rows: data, rowCount: data?.length || 0 };
    }

    if (lowerText.includes('from gallery_images')) {
      let query = supabase.from('gallery_images').select('*');

      // Handle category filter
      if (lowerText.includes('where category =') && _params.length > 0) {
        query = query.eq('category', _params[0]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { rows: data, rowCount: data?.length || 0 };
    }
  }

  // Handle INSERT queries
  if (lowerText.startsWith('insert')) {
    if (lowerText.includes('into contact_messages')) {
      // Extract values for contact message insertion
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: _params[0],
          email: _params[1],
          subject: _params[2],
          message: _params[3],
          phone: _params[4] || null
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into notification_bars')) {
      const { data, error } = await supabase
        .from('notification_bars')
        .insert({
          message: _params[0],
          type: _params[1],
          is_active: _params[2],
          start_date: _params[3],
          end_date: _params[4]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into rooms')) {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          room_number: _params[0],
          description: _params[1],
          price_per_night: _params[2],
          capacity: _params[3],
          room_type: _params[4],
          image_url: _params[5],
          amenities: _params[6],
          display_category: _params[7],
          is_available: _params[8]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into menu_items')) {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          item_name: _params[0],
          category: _params[1],
          description: _params[2],
          price: _params[3],
          preparation_time: _params[4],
          tags: _params[5],
          image_url: _params[6]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into menu_images')) {
      const { data, error } = await supabase
        .from('menu_images')
        .insert({
          title: _params[0],
          category: _params[1],
          image_url: _params[2]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into gallery_images')) {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          image_url: _params[0],
          title: _params[1],
          description: _params[2],
          category: _params[3]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }
  }

  // Handle UPDATE queries
  if (lowerText.startsWith('update')) {
    // Basic UPDATE support - can be extended as needed
    console.warn('UPDATE queries not fully implemented in Supabase fallback');
  }

  // Handle DELETE queries
  if (lowerText.startsWith('delete')) {
    // Basic DELETE support - can be extended as needed
    console.warn('DELETE queries not fully implemented in Supabase fallback');
  }

  // For other queries, throw an error indicating fallback limitation
  throw new Error(`Supabase fallback not implemented for query: ${text.substring(0, 50)}...`);
}

// Helper function to execute a transaction
export const transaction = async (callback: (client: PoolClient) => Promise<any>): Promise<any> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default {
  query,
  getClient,
  transaction,
  pool
};
