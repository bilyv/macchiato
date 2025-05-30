# Supabase Database Setup Guide

## 🎯 Overview
This guide will help you deploy your main.sql schema to Supabase and configure your backend to use Supabase instead of local PostgreSQL.

## ✅ What's Already Configured

### 1. Environment Variables (.env)
```env
# Supabase Configuration
SUPABASE_URL=https://whiijcszqrggkesbfjdg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connection
PGHOST=db.whiijcszqrggkesbfjdg.supabase.co
PGUSER=postgres
PGDATABASE=postgres
PGPASSWORD=macchiato22@gmail.com
PGPORT=5432
```

### 2. Supabase Client Setup
- ✅ @supabase/supabase-js package installed
- ✅ Supabase client configured in `src/config/supabase.ts`
- ✅ Database configuration updated to use Supabase

### 3. Backend Integration
- ✅ Database connection updated to use Supabase PostgreSQL
- ✅ All API endpoints ready to work with Supabase

## 🚀 Manual Schema Deployment Steps

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Navigate to your project: `whiijcszqrggkesbfjdg`

### Step 2: Open SQL Editor
1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** to create a new SQL query

### Step 3: Deploy the Schema
1. Copy the entire contents of `backend/src/db/main.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute the schema

### Step 4: Verify Deployment
After running the schema, you should see these tables created:
- ✅ users
- ✅ rooms  
- ✅ contact_messages
- ✅ gallery_images
- ✅ notification_bars
- ✅ menu_items
- ✅ menu_images

### Step 5: Check Default Admin User
The schema includes a default admin user:
- **Email**: project@gmail.com
- **Password**: project
- **Role**: admin

## 🔧 Testing the Setup

### 1. Start Backend Server
```bash
cd backend
bun run dev
```

### 2. Test API Endpoints
- **Health Check**: `GET http://localhost:3000/api/health`
- **Login**: `POST http://localhost:3000/api/auth/login`
- **Rooms**: `GET http://localhost:3000/api/rooms`

### 3. Test Database Connection
The server should show:
```
✅ Connected to Supabase PostgreSQL database
🚀 Successfully connected to Supabase database: postgres
```

## 🛠️ Troubleshooting

### Connection Issues
If you see connection errors:

1. **Check Supabase Project Status**
   - Ensure your Supabase project is active
   - Verify the project URL matches your .env file

2. **Verify Database Credentials**
   - Double-check the password: `macchiato22@gmail.com`
   - Ensure the host is correct: `db.whiijcszqrggkesbfjdg.supabase.co`

3. **Network/Firewall Issues**
   - Try accessing Supabase dashboard to confirm connectivity
   - Check if your network blocks PostgreSQL connections

### Alternative Connection Methods

If direct PostgreSQL connection fails, the backend can still work using Supabase client APIs:

1. **Update Controllers** to use Supabase client instead of raw SQL
2. **Use Supabase Auth** for user authentication
3. **Use Supabase Storage** for file uploads

## 📋 Schema Contents

The main.sql file includes:

### Tables
1. **users** - User authentication and profiles
2. **rooms** - Hotel room information
3. **contact_messages** - Customer inquiries
4. **gallery_images** - Website gallery
5. **notification_bars** - Site notifications
6. **menu_items** - Restaurant menu suggestions
7. **menu_images** - Menu category images

### Features
- ✅ UUID primary keys
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Proper indexes for performance
- ✅ Data validation constraints
- ✅ Default admin user

## 🎉 Next Steps

After successful deployment:

1. **Test Room Management**
   - Add rooms through admin panel
   - Test room lookup functionality

2. **Configure Cloudinary**
   - Add your Cloudinary credentials to .env
   - Test image upload functionality

3. **Deploy Frontend**
   - Update frontend API endpoints if needed
   - Test full application flow

## 🔐 Security Notes

- Change default admin password in production
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) in Supabase for production
- Consider using Supabase Auth instead of custom JWT
