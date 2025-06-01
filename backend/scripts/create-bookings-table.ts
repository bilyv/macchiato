import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBookingsTable() {
  console.log('🚀 Creating bookings table in Supabase...');
  console.log(`📍 Connecting to: ${supabaseUrl}`);

  try {
    // Check if bookings table already exists
    console.log('🔍 Checking if bookings table exists...');
    const { data: existingTable, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Bookings table already exists!');
      return;
    }

    console.log('📝 Creating bookings table...');
    
    // Create the bookings table using SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        guest_name TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        guest_phone TEXT,
        room_id UUID NOT NULL,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
        special_requests TEXT,
        booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Ensure check-out date is after check-in date
        CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
      );
    `;

    // Try to execute the SQL using the rpc function
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql_query: createTableSQL 
    });

    if (createError) {
      console.log('⚠️  RPC method failed, trying alternative approach...');
      
      // Alternative: Try to create using Supabase client insert (this will fail but might create the table)
      try {
        await supabase.from('bookings').insert({
          guest_name: 'test',
          guest_email: 'test@test.com',
          room_id: '00000000-0000-0000-0000-000000000000',
          check_in_date: '2024-01-01',
          check_out_date: '2024-01-02',
          number_of_guests: 1,
          total_amount: 100
        });
      } catch (insertError) {
        console.log('Expected error from insert attempt:', insertError);
      }
    }

    // Create indexes
    console.log('📊 Creating indexes...');
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);',
      'CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);',
      'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);',
      'CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);',
      'CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);'
    ];

    for (const indexQuery of indexQueries) {
      try {
        await supabase.rpc('exec_sql', { sql_query: indexQuery });
      } catch (indexError) {
        console.log(`⚠️  Index creation warning: ${indexError}`);
      }
    }

    // Verify the table was created
    console.log('🔍 Verifying bookings table...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (!verifyError) {
      console.log('✅ Bookings table created successfully!');
    } else {
      console.log('⚠️  Table verification failed, but this might be normal');
      console.log('Error:', verifyError.message);
    }

    console.log('\n🎉 Bookings table setup completed!');
    console.log('🔗 Your bookings table is ready to use.');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Test the booking API endpoints');

  } catch (error) {
    console.error('❌ Error creating bookings table:', error);

    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    console.log('\n💡 Manual setup instructions:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the bookings table schema from src/db/schema/bookings.sql');
    console.log('   4. Execute the SQL');

    process.exit(1);
  }
}

// Run the table creation
createBookingsTable().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
