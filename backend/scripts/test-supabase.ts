import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 20)}...`);

  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('⚠️  Users table does not exist - schema needs to be deployed');
        console.log('📋 Please follow the manual deployment steps in SUPABASE_SETUP.md');
      } else {
        console.log('❌ Connection error:', error.message);
      }
    } else {
      console.log('✅ Basic connection successful!');
      console.log(`📊 Users table accessible`);
    }

    // Test 2: Check if tables exist
    console.log('\n2️⃣ Checking table existence...');
    const tables = ['users', 'rooms', 'contact_messages', 'gallery_images', 'notification_bars', 'menu_items'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1);
        
        if (tableError) {
          if (tableError.message.includes('does not exist')) {
            console.log(`❌ Table "${table}" does not exist`);
          } else {
            console.log(`⚠️  Table "${table}" exists but has access issues`);
          }
        } else {
          console.log(`✅ Table "${table}" exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Error checking table "${table}":`, err);
      }
    }

    // Test 3: Check admin user (if users table exists)
    console.log('\n3️⃣ Checking admin user...');
    try {
      const { data: adminUser, error: adminError } = await supabase
        .from('users')
        .select('email, role')
        .eq('role', 'admin')
        .limit(1);

      if (adminError) {
        console.log('❌ Cannot check admin user:', adminError.message);
      } else if (adminUser && adminUser.length > 0) {
        console.log(`✅ Admin user found: ${adminUser[0].email}`);
      } else {
        console.log('⚠️  No admin user found');
      }
    } catch (err) {
      console.log('❌ Error checking admin user:', err);
    }

    // Test 4: Test room operations
    console.log('\n4️⃣ Testing room operations...');
    try {
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('id, room_number, room_type')
        .limit(5);

      if (roomsError) {
        console.log('❌ Cannot query rooms:', roomsError.message);
      } else {
        console.log(`✅ Rooms table accessible - found ${rooms?.length || 0} rooms`);
        if (rooms && rooms.length > 0) {
          console.log('📋 Sample rooms:');
          rooms.forEach(room => {
            console.log(`   - Room ${room.room_number}: ${room.room_type}`);
          });
        }
      }
    } catch (err) {
      console.log('❌ Error testing rooms:', err);
    }

    console.log('\n🎉 Supabase connection test completed!');
    
    // Provide next steps based on results
    console.log('\n📝 Next Steps:');
    if (error && error.message.includes('does not exist')) {
      console.log('   1. Deploy schema using Supabase Dashboard SQL Editor');
      console.log('   2. Copy contents of src/db/main.sql');
      console.log('   3. Paste and run in Supabase SQL Editor');
      console.log('   4. Run this test again: bun run test-supabase');
    } else {
      console.log('   1. Start backend server: bun run dev');
      console.log('   2. Test API endpoints');
      console.log('   3. Login with: project@gmail.com / project');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify Supabase project is active');
    console.log('   3. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env');
    console.log('   4. Try accessing Supabase dashboard manually');
  }
}

// Run the test
testSupabaseConnection().catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
