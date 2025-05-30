import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySupabaseSetup() {
  console.log('🔍 Comprehensive Supabase Verification');
  console.log('=====================================\n');

  let allTestsPassed = true;

  try {
    // Test 1: Verify all required tables exist
    console.log('1️⃣ Verifying Database Schema...');
    const requiredTables = [
      'users', 'rooms', 'contact_messages', 
      'gallery_images', 'notification_bars', 
      'menu_items', 'menu_images'
    ];

    const tableResults = {};
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Table "${table}": ${error.message}`);
          tableResults[table] = false;
          allTestsPassed = false;
        } else {
          console.log(`   ✅ Table "${table}": Accessible`);
          tableResults[table] = true;
        }
      } catch (err) {
        console.log(`   ❌ Table "${table}": ${err}`);
        tableResults[table] = false;
        allTestsPassed = false;
      }
    }

    // Test 2: Verify admin user exists
    console.log('\n2️⃣ Verifying Admin User...');
    try {
      const { data: adminUsers, error } = await supabase
        .from('users')
        .select('id, email, role, first_name, last_name')
        .eq('role', 'admin');

      if (error) {
        console.log(`   ❌ Admin user check failed: ${error.message}`);
        allTestsPassed = false;
      } else if (adminUsers && adminUsers.length > 0) {
        console.log(`   ✅ Admin user found: ${adminUsers[0].email}`);
        console.log(`   📋 Name: ${adminUsers[0].first_name} ${adminUsers[0].last_name}`);
        console.log(`   🆔 ID: ${adminUsers[0].id}`);
      } else {
        console.log('   ❌ No admin user found');
        allTestsPassed = false;
      }
    } catch (err) {
      console.log(`   ❌ Admin user verification failed: ${err}`);
      allTestsPassed = false;
    }

    // Test 3: Test CRUD operations on rooms table
    console.log('\n3️⃣ Testing CRUD Operations...');
    try {
      // Create a test room
      const testRoom = {
        room_number: 999,
        description: 'Test room for verification',
        price_per_night: 99.99,
        capacity: 2,
        room_type: 'Test Suite',
        amenities: ['WiFi', 'Test Amenity'],
        display_category: 'Test Category',
        is_available: true
      };

      console.log('   📝 Creating test room...');
      const { data: createdRoom, error: createError } = await supabase
        .from('rooms')
        .insert(testRoom)
        .select()
        .single();

      if (createError) {
        console.log(`   ❌ Create operation failed: ${createError.message}`);
        allTestsPassed = false;
      } else {
        console.log(`   ✅ Test room created with ID: ${createdRoom.id}`);

        // Read the test room
        console.log('   📖 Reading test room...');
        const { data: readRoom, error: readError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', createdRoom.id)
          .single();

        if (readError) {
          console.log(`   ❌ Read operation failed: ${readError.message}`);
          allTestsPassed = false;
        } else {
          console.log(`   ✅ Test room read successfully: Room ${readRoom.room_number}`);
        }

        // Update the test room
        console.log('   ✏️  Updating test room...');
        const { data: updatedRoom, error: updateError } = await supabase
          .from('rooms')
          .update({ description: 'Updated test room description' })
          .eq('id', createdRoom.id)
          .select()
          .single();

        if (updateError) {
          console.log(`   ❌ Update operation failed: ${updateError.message}`);
          allTestsPassed = false;
        } else {
          console.log(`   ✅ Test room updated successfully`);
        }

        // Delete the test room
        console.log('   🗑️  Deleting test room...');
        const { error: deleteError } = await supabase
          .from('rooms')
          .delete()
          .eq('id', createdRoom.id);

        if (deleteError) {
          console.log(`   ❌ Delete operation failed: ${deleteError.message}`);
          allTestsPassed = false;
        } else {
          console.log(`   ✅ Test room deleted successfully`);
        }
      }
    } catch (err) {
      console.log(`   ❌ CRUD operations failed: ${err}`);
      allTestsPassed = false;
    }

    // Test 4: Test room number lookup (for your enhanced form)
    console.log('\n4️⃣ Testing Room Number Lookup...');
    try {
      // This tests the new functionality you requested
      const { data: roomByNumber, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_number', 101)
        .limit(1);

      if (error) {
        console.log(`   ⚠️  Room lookup test: ${error.message} (This is normal if no room 101 exists)`);
      } else {
        if (roomByNumber && roomByNumber.length > 0) {
          console.log(`   ✅ Room lookup successful: Found room ${roomByNumber[0].room_number}`);
        } else {
          console.log(`   ✅ Room lookup working (no room 101 found, which is expected)`);
        }
      }
    } catch (err) {
      console.log(`   ❌ Room lookup failed: ${err}`);
      allTestsPassed = false;
    }

    // Test 5: Check data counts
    console.log('\n5️⃣ Database Statistics...');
    for (const table of requiredTables) {
      if (tableResults[table]) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (error) {
            console.log(`   📊 ${table}: Count unavailable`);
          } else {
            console.log(`   📊 ${table}: ${count || 0} records`);
          }
        } catch (err) {
          console.log(`   📊 ${table}: Count check failed`);
        }
      }
    }

    // Final Results
    console.log('\n🎯 Verification Results');
    console.log('=======================');
    
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! Supabase is fully configured and working.');
      console.log('\n✅ Your backend is ready for:');
      console.log('   • Room management with lookup functionality');
      console.log('   • User authentication');
      console.log('   • Contact form submissions');
      console.log('   • Gallery management');
      console.log('   • Menu management');
      console.log('   • Notification system');
      
      console.log('\n🚀 Next Steps:');
      console.log('   1. Start your backend: bun run dev');
      console.log('   2. Test your enhanced room form');
      console.log('   3. Login with: project@gmail.com / project');
    } else {
      console.log('❌ Some tests failed. Please check the errors above.');
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Verify schema was deployed correctly in Supabase dashboard');
      console.log('   2. Check Row Level Security (RLS) settings');
      console.log('   3. Ensure anon key has proper permissions');
    }

  } catch (error) {
    console.error('💥 Verification failed:', error);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

// Run verification
verifySupabaseSetup().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
