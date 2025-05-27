import { query } from '../config/database.js';

async function createAdminUser() {
  console.log('Creating default admin user...');
  
  try {
    // Insert default admin user
    const result = await query(`
      INSERT INTO users (
        email, 
        password, 
        first_name, 
        last_name, 
        role
      ) VALUES (
        'project@gmail.com',
        '$2b$10$koInpOjeLCMl6gDwhEBmM.cVTI4yAHt7fZvEwbC2ONbydyFhsflWy',
        'Admin',
        'User',
        'admin'
      ) ON CONFLICT (email) DO NOTHING
      RETURNING id, email, first_name, last_name, role;
    `);
    
    if (result.rowCount > 0) {
      console.log('✅ Default admin user created successfully!');
      console.log('📧 Email: project@gmail.com');
      console.log('🔑 Password: project');
      console.log('👤 Role: admin');
      console.log('');
      console.log('⚠️  IMPORTANT: Change these credentials in production!');
    } else {
      console.log('ℹ️  Admin user already exists, skipping creation.');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
