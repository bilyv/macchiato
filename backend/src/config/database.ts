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

      // If Supabase error has useful information (like constraint violations), throw that instead
      if (supabaseError && typeof supabaseError === 'object' && 'code' in supabaseError) {
        throw supabaseError; // Throw the Supabase error which has more specific information
      }

      throw error; // Throw the original PostgreSQL error as fallback
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

    // Handle external users authentication queries
    if (lowerText.includes('from external_users')) {
      if (lowerText.includes('where email =') && _params.length > 0) {
        // Login query - select external user by email
        const { data, error } = await supabase
          .from('external_users')
          .select('*')
          .eq('email', _params[0])
          .eq('is_active', true)
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
        // Get external user by ID (for auth middleware)
        const { data, error } = await supabase
          .from('external_users')
          .select('id, email, role')
          .eq('id', _params[0])
          .eq('is_active', true)
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

      // Handle website visibility filter for public access
      if (lowerText.includes('where is_website_visible = true')) {
        query = query.eq('is_website_visible', true);
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

    if (lowerText.includes('from bookings')) {
      // Handle booking queries with joins
      if (lowerText.includes('join rooms')) {
        // This is a complex join query - we'll handle it differently
        let bookingsQuery = supabase.from('bookings').select('*');

        // Apply filters
        if (lowerText.includes('booking_status =') && _params.length > 0) {
          const statusParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('booking_status ='));
          if (statusParamIndex !== -1) {
            bookingsQuery = bookingsQuery.eq('booking_status', _params[statusParamIndex]);
          }
        }

        if (lowerText.includes('room_id =') && _params.length > 0) {
          const roomIdParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('room_id ='));
          if (roomIdParamIndex !== -1) {
            bookingsQuery = bookingsQuery.eq('room_id', _params[roomIdParamIndex]);
          }
        }

        if (lowerText.includes('guest_email ilike') && _params.length > 0) {
          const emailParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('guest_email ilike'));
          if (emailParamIndex !== -1) {
            const emailPattern = _params[emailParamIndex].replace(/%/g, '');
            bookingsQuery = bookingsQuery.ilike('guest_email', `%${emailPattern}%`);
          }
        }

        // Handle pagination
        if (lowerText.includes('limit') && lowerText.includes('offset')) {
          const limitMatch = lowerText.match(/limit \$(\d+)/);
          const offsetMatch = lowerText.match(/offset \$(\d+)/);
          if (limitMatch && offsetMatch) {
            const limitParamIndex = parseInt(limitMatch[1]) - 1;
            const offsetParamIndex = parseInt(offsetMatch[1]) - 1;
            if (_params[limitParamIndex] && _params[offsetParamIndex]) {
              bookingsQuery = bookingsQuery.range(
                parseInt(_params[offsetParamIndex]),
                parseInt(_params[offsetParamIndex]) + parseInt(_params[limitParamIndex]) - 1
              );
            }
          }
        }

        const { data: bookings, error: bookingsError } = await bookingsQuery.order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Now fetch room data for each booking
        if (bookings && bookings.length > 0) {
          const roomIds = [...new Set(bookings.map(b => b.room_id))];
          const { data: rooms, error: roomsError } = await supabase
            .from('rooms')
            .select('id, room_number, room_type, price_per_night, description, image_url')
            .in('id', roomIds);

          if (roomsError) throw roomsError;

          // Combine booking and room data
          const combinedData = bookings.map(booking => {
            const room = rooms?.find(r => r.id === booking.room_id);
            return {
              ...booking,
              room_number: room?.room_number,
              room_type: room?.room_type,
              price_per_night: room?.price_per_night,
              room_description: room?.description,
              room_image_url: room?.image_url
            };
          });

          return { rows: combinedData, rowCount: combinedData.length };
        }

        return { rows: [], rowCount: 0 };
      }

      // Handle single booking by ID
      if (lowerText.includes('where b.id =') && _params.length > 0) {
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', _params[0])
          .single();

        if (bookingError) {
          if (bookingError.code === 'PGRST116') {
            return { rows: [], rowCount: 0 };
          }
          throw bookingError;
        }

        // Fetch room data
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .select('room_number, room_type, price_per_night, description, image_url')
          .eq('id', booking.room_id)
          .single();

        if (roomError) throw roomError;

        const combinedData = {
          ...booking,
          room_number: room.room_number,
          room_type: room.room_type,
          price_per_night: room.price_per_night,
          room_description: room.description,
          room_image_url: room.image_url
        };

        return { rows: [combinedData], rowCount: 1 };
      }

      // Handle overlap checking query
      if (lowerText.includes('booking_status in') && lowerText.includes('check_in_date') && lowerText.includes('check_out_date')) {
        const roomId = _params[0];
        const checkInDate = _params[1];
        const checkOutDate = _params[2];

        const { data, error } = await supabase
          .from('bookings')
          .select('id')
          .eq('room_id', roomId)
          .in('booking_status', ['pending', 'confirmed'])
          .or(`and(check_in_date.lte.${checkInDate},check_out_date.gt.${checkInDate}),and(check_in_date.lt.${checkOutDate},check_out_date.gte.${checkOutDate}),and(check_in_date.gte.${checkInDate},check_out_date.lte.${checkOutDate})`);

        if (error) throw error;
        return { rows: data || [], rowCount: data?.length || 0 };
      }

      // Handle COUNT queries for pagination
      if (lowerText.includes('select count(*)')) {
        let countQuery = supabase.from('bookings').select('*', { count: 'exact', head: true });

        // Apply the same filters as the main query
        if (lowerText.includes('booking_status =') && _params.length > 0) {
          const statusParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('booking_status ='));
          if (statusParamIndex !== -1) {
            countQuery = countQuery.eq('booking_status', _params[statusParamIndex]);
          }
        }

        if (lowerText.includes('room_id =') && _params.length > 0) {
          const roomIdParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('room_id ='));
          if (roomIdParamIndex !== -1) {
            countQuery = countQuery.eq('room_id', _params[roomIdParamIndex]);
          }
        }

        if (lowerText.includes('guest_email ilike') && _params.length > 0) {
          const emailParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('guest_email ilike'));
          if (emailParamIndex !== -1) {
            const emailPattern = _params[emailParamIndex].replace(/%/g, '');
            countQuery = countQuery.ilike('guest_email', `%${emailPattern}%`);
          }
        }

        const { count, error } = await countQuery;

        if (error) throw error;
        return { rows: [{ total: count || 0 }], rowCount: 1 };
      }

      // Handle simple bookings query with filters and pagination
      let bookingsQuery = supabase.from('bookings').select('*');

      // Apply filters based on the SQL query
      if (lowerText.includes('booking_status =') && _params.length > 0) {
        const statusParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('booking_status ='));
        if (statusParamIndex !== -1) {
          bookingsQuery = bookingsQuery.eq('booking_status', _params[statusParamIndex]);
        }
      }

      if (lowerText.includes('room_id =') && _params.length > 0) {
        const roomIdParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('room_id ='));
        if (roomIdParamIndex !== -1) {
          bookingsQuery = bookingsQuery.eq('room_id', _params[roomIdParamIndex]);
        }
      }

      if (lowerText.includes('guest_email ilike') && _params.length > 0) {
        const emailParamIndex = _params.findIndex((_, i) => lowerText.includes(`$${i + 1}`) && lowerText.indexOf(`$${i + 1}`) > lowerText.indexOf('guest_email ilike'));
        if (emailParamIndex !== -1) {
          const emailPattern = _params[emailParamIndex].replace(/%/g, '');
          bookingsQuery = bookingsQuery.ilike('guest_email', `%${emailPattern}%`);
        }
      }

      // Handle pagination
      if (lowerText.includes('limit') && lowerText.includes('offset')) {
        const limitMatch = lowerText.match(/limit \$(\d+)/);
        const offsetMatch = lowerText.match(/offset \$(\d+)/);
        if (limitMatch && offsetMatch) {
          const limitParamIndex = parseInt(limitMatch[1]) - 1;
          const offsetParamIndex = parseInt(offsetMatch[1]) - 1;
          if (_params[limitParamIndex] && _params[offsetParamIndex]) {
            bookingsQuery = bookingsQuery.range(
              parseInt(_params[offsetParamIndex]),
              parseInt(_params[offsetParamIndex]) + parseInt(_params[limitParamIndex]) - 1
            );
          }
        }
      }

      const { data, error } = await bookingsQuery.order('created_at', { ascending: false });

      if (error) throw error;
      return { rows: data || [], rowCount: data?.length || 0 };
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
          is_available: _params[7],
          is_website_visible: _params[8] || false
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

    if (lowerText.includes('into bookings')) {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          guest_name: _params[0],
          guest_email: _params[1],
          guest_phone: _params[2],
          room_id: _params[3],
          check_in_date: _params[4],
          check_out_date: _params[5],
          number_of_guests: _params[6],
          special_requests: _params[7],
          total_amount: _params[8]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into external_users')) {
      const { data, error } = await supabase
        .from('external_users')
        .insert({
          email: _params[0],
          password: _params[1],
          first_name: _params[2],
          last_name: _params[3],
          created_by: _params[4]
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }

    if (lowerText.includes('into guests')) {
      const { data, error } = await supabase
        .from('guests')
        .insert({
          first_name: _params[0],
          last_name: _params[1],
          email: _params[2],
          phone: _params[3] || null,
          city: _params[4] || null,
          country: _params[5] || null,
          date_of_birth: _params[6] || null,
          identification_type: _params[7] || null,
          identification_number: _params[8] || null,
          special_requirements: _params[9] || null,
          room_number: _params[10] || null,
          check_in_date: _params[11] || null,
          check_out_date: _params[12] || null,
          number_of_guests: _params[13] || 1,
          total_price: _params[14] || null,
          created_by_user_id: _params[15] || null,
          created_by_external_user_id: _params[16] || null
        })
        .select()
        .single();

      if (error) throw error;
      return { rows: [data], rowCount: 1 };
    }
  }

  // Handle UPDATE queries
  if (lowerText.startsWith('update')) {
    console.log('Executing UPDATE query via Supabase fallback:', text);

    // Handle UPDATE rooms SET ... WHERE id = $X (single room update)
    if (lowerText.includes('update rooms set') && lowerText.includes('where id =')) {
      // Extract the room ID (it's the last parameter)
      const roomId = _params[_params.length - 1];
      console.log('Updating room with ID:', roomId);

      const updateData: any = {
        room_number: _params[0],
        description: _params[1],
        price_per_night: _params[2],
        capacity: _params[3],
        room_type: _params[4],
        image_url: _params[5],
        amenities: _params[6],
        is_available: _params[7],
        is_website_visible: _params[8]
      };

      const { data, error } = await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', roomId)
        .select()
        .single();

      if (error) {
        console.error('Supabase UPDATE error:', error);
        throw error;
      }

      console.log('Room updated successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle bulk UPDATE for website visibility (ADD TO SITE)
    if (lowerText.includes('update rooms set') && lowerText.includes('is_website_visible = true')) {
      console.log('Bulk adding rooms to website, room IDs:', _params);

      const { data, error } = await supabase
        .from('rooms')
        .update({ is_website_visible: true })
        .in('id', _params)
        .select();

      if (error) {
        console.error('Supabase bulk UPDATE error:', error);
        throw error;
      }

      console.log('Rooms added to website successfully:', data);
      return { rows: data, rowCount: data.length };
    }

    // Handle bulk UPDATE for website visibility (REMOVE FROM SITE)
    if (lowerText.includes('update rooms set') && lowerText.includes('is_website_visible = false')) {
      console.log('Bulk removing rooms from website, room IDs:', _params);

      const { data, error } = await supabase
        .from('rooms')
        .update({ is_website_visible: false })
        .in('id', _params)
        .select();

      if (error) {
        console.error('Supabase bulk UPDATE error:', error);
        throw error;
      }

      console.log('Rooms removed from website successfully:', data);
      return { rows: data, rowCount: data.length };
    }

    // Handle booking status updates
    if (lowerText.includes('update bookings') && lowerText.includes('booking_status =') && lowerText.includes('updated_at = now()')) {
      const bookingStatus = _params[0];
      const bookingId = _params[1];
      console.log('Updating booking status:', bookingStatus, 'for booking ID:', bookingId);

      const updateData = {
        booking_status: bookingStatus,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Supabase booking UPDATE error:', error);
        throw error;
      }

      console.log('Booking status updated successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle booking cancellation
    if (lowerText.includes('update bookings set') && lowerText.includes('booking_status = \'cancelled\'')) {
      const bookingId = _params[0];
      console.log('Cancelling booking with ID:', bookingId);

      const { data, error } = await supabase
        .from('bookings')
        .update({ booking_status: 'cancelled' })
        .eq('id', bookingId)
        .in('booking_status', ['pending', 'confirmed'])
        .select()
        .single();

      if (error) {
        console.error('Supabase booking cancellation error:', error);
        throw error;
      }

      console.log('Booking cancelled successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle contact message mark as read
    if (lowerText.includes('update contact_messages') && lowerText.includes('is_read = true') && lowerText.includes('where id =')) {
      const contactId = _params[0];
      console.log('Marking contact message as read with ID:', contactId);

      const { data, error } = await supabase
        .from('contact_messages')
        .update({
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        console.error('Supabase contact message UPDATE error:', error);
        throw error;
      }

      console.log('Contact message marked as read successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // If no specific UPDATE pattern matches, log and throw error
    console.warn('UPDATE query pattern not recognized:', text);
    throw new Error(`UPDATE query pattern not implemented: ${text.substring(0, 100)}...`);
  }

  // Handle DELETE queries
  if (lowerText.startsWith('delete')) {
    console.log('Executing DELETE query via Supabase fallback:', text);

    // Handle DELETE FROM rooms WHERE id = $1
    if (lowerText.includes('from rooms') && lowerText.includes('where id =')) {
      const roomId = _params[0];
      console.log('Deleting room with ID:', roomId);

      const { data, error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Room deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM contact_messages WHERE id = $1
    if (lowerText.includes('from contact_messages') && lowerText.includes('where id =')) {
      const contactId = _params[0];
      console.log('Deleting contact message with ID:', contactId);

      const { data, error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', contactId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Contact message deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM menu_items WHERE id = $1
    if (lowerText.includes('from menu_items') && lowerText.includes('where id =')) {
      const menuItemId = _params[0];
      console.log('Deleting menu item with ID:', menuItemId);

      const { data, error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', menuItemId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Menu item deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM gallery_images WHERE id = $1
    if (lowerText.includes('from gallery_images') && lowerText.includes('where id =')) {
      const galleryImageId = _params[0];
      console.log('Deleting gallery image with ID:', galleryImageId);

      const { data, error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', galleryImageId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Gallery image deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM notification_bars WHERE id = $1
    if (lowerText.includes('from notification_bars') && lowerText.includes('where id =')) {
      const notificationId = _params[0];
      console.log('Deleting notification bar with ID:', notificationId);

      const { data, error } = await supabase
        .from('notification_bars')
        .delete()
        .eq('id', notificationId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Notification bar deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM bookings WHERE id = $1
    if (lowerText.includes('from bookings') && lowerText.includes('where id =')) {
      const bookingId = _params[0];
      console.log('Deleting booking with ID:', bookingId);

      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Booking deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM external_users WHERE id = $1
    if (lowerText.includes('from external_users') && lowerText.includes('where id =')) {
      const externalUserId = _params[0];
      console.log('Deleting external user with ID:', externalUserId);

      const { data, error } = await supabase
        .from('external_users')
        .delete()
        .eq('id', externalUserId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('External user deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // Handle DELETE FROM guests WHERE id = $1
    if (lowerText.includes('from guests') && lowerText.includes('where id =')) {
      const guestId = _params[0];
      console.log('Deleting guest with ID:', guestId);

      const { data, error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DELETE error:', error);
        throw error;
      }

      console.log('Guest deleted successfully:', data);
      return { rows: [data], rowCount: 1 };
    }

    // If no specific DELETE pattern matches, log and throw error
    console.warn('DELETE query pattern not recognized:', text);
    throw new Error(`DELETE query pattern not implemented: ${text.substring(0, 100)}...`);
  }

  // Handle external users queries with JOINs
  if (text.includes('FROM external_users eu') && text.includes('LEFT JOIN users u')) {
    if (text.includes('WHERE eu.id = $1')) {
      // Get external user by ID with creator info
      const { data, error } = await supabase
        .from('external_users')
        .select(`
          *,
          users!external_users_created_by_fkey(first_name, last_name)
        `)
        .eq('id', _params[0])
        .single();

      if (error) throw error;

      if (data) {
        // Flatten the creator info
        const result = {
          ...data,
          creator_first_name: data.users?.first_name || null,
          creator_last_name: data.users?.last_name || null
        };
        delete result.users;
        return { rows: [result], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    } else {
      // Get all external users with creator info
      const { data, error } = await supabase
        .from('external_users')
        .select(`
          *,
          users!external_users_created_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Flatten the creator info for each user
      const results = (data || []).map(user => ({
        ...user,
        creator_first_name: user.users?.first_name || null,
        creator_last_name: user.users?.last_name || null,
        users: undefined
      }));

      return { rows: results, rowCount: results.length };
    }
  }

  // Handle specific guest query with CONCAT for external users only
  if (text.includes('CONCAT(eu.first_name') && text.includes('FROM guests g') && text.includes('LEFT JOIN external_users eu') && text.includes('WHERE g.created_by_external_user_id = $1')) {
    // Get guests by external user ID with creator name
    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        external_users!guests_created_by_external_user_id_fkey(first_name, last_name)
      `)
      .eq('created_by_external_user_id', _params[0])
      .order('created_at', { ascending: false });

    if (error) throw error;

    const results = (data || []).map(guest => ({
      ...guest,
      creator_name: guest.external_users ? `${guest.external_users.first_name} ${guest.external_users.last_name}` : 'Unknown',
      creator_type: 'external_user',
      external_users: undefined
    }));

    return { rows: results, rowCount: results.length };
  }

  // Handle guest by ID query with CASE and CONCAT
  if (text.includes('CASE') && text.includes('CONCAT(u.first_name') && text.includes('CONCAT(eu.first_name') && text.includes('FROM guests g') && text.includes('WHERE g.id = $1')) {
    // Get guest by ID with creator info using CASE logic
    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        users!guests_created_by_user_id_fkey(first_name, last_name),
        external_users!guests_created_by_external_user_id_fkey(first_name, last_name)
      `)
      .eq('id', _params[0])
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Guest not found');
      }
      throw error;
    }

    if (data) {
      // Implement CASE logic for creator info
      let creator_name = 'Unknown';
      let creator_type = 'unknown';

      if (data.created_by_user_id && data.users) {
        creator_name = `${data.users.first_name} ${data.users.last_name}`;
        creator_type = 'admin';
      } else if (data.created_by_external_user_id && data.external_users) {
        creator_name = `${data.external_users.first_name} ${data.external_users.last_name}`;
        creator_type = 'external_user';
      }

      const result = {
        ...data,
        creator_name,
        creator_type
      };
      delete result.users;
      delete result.external_users;

      return { rows: [result], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Handle guests queries with JOINs
  if (text.includes('FROM guests g') && text.includes('LEFT JOIN users u') && text.includes('LEFT JOIN external_users eu')) {
    if (text.includes('WHERE g.id = $1')) {
      // Get guest by ID with creator info
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          users!guests_created_by_user_id_fkey(first_name, last_name),
          external_users!guests_created_by_external_user_id_fkey(first_name, last_name)
        `)
        .eq('id', _params[0])
        .single();

      if (error) throw error;

      if (data) {
        // Determine creator info and type
        let creator_name = 'Unknown';
        let creator_type = 'unknown';

        if (data.created_by_user_id && data.users) {
          creator_name = `${data.users.first_name} ${data.users.last_name}`;
          creator_type = 'admin';
        } else if (data.created_by_external_user_id && data.external_users) {
          creator_name = `${data.external_users.first_name} ${data.external_users.last_name}`;
          creator_type = 'external_user';
        }

        const result = {
          ...data,
          creator_name,
          creator_type
        };
        delete result.users;
        delete result.external_users;

        return { rows: [result], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    } else if (text.includes('WHERE g.created_by_external_user_id = $1')) {
      // Get guests by external user ID
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          external_users!guests_created_by_external_user_id_fkey(first_name, last_name)
        `)
        .eq('created_by_external_user_id', _params[0])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const results = (data || []).map(guest => ({
        ...guest,
        creator_name: guest.external_users ? `${guest.external_users.first_name} ${guest.external_users.last_name}` : 'Unknown',
        creator_type: 'external_user',
        external_users: undefined
      }));

      return { rows: results, rowCount: results.length };
    } else {
      // Get all guests with creator info
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          users!guests_created_by_user_id_fkey(first_name, last_name),
          external_users!guests_created_by_external_user_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const results = (data || []).map(guest => {
        let creator_name = 'Unknown';
        let creator_type = 'unknown';

        if (guest.created_by_user_id && guest.users) {
          creator_name = `${guest.users.first_name} ${guest.users.last_name}`;
          creator_type = 'admin';
        } else if (guest.created_by_external_user_id && guest.external_users) {
          creator_name = `${guest.external_users.first_name} ${guest.external_users.last_name}`;
          creator_type = 'external_user';
        }

        return {
          ...guest,
          creator_name,
          creator_type,
          users: undefined,
          external_users: undefined
        };
      });

      return { rows: results, rowCount: results.length };
    }
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
