-- Macchiato Suites Database Schema
-- Complete database schema for the luxury hotel management system
-- Created: 2025
-- Description: This file contains the complete database schema including all tables, functions, triggers, and indexes

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- TABLES
-- =============================================================================

-- Users Table
-- This table stores user authentication and profile information
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms Table
-- This table stores hotel room information including pricing, amenities, and availability
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number INTEGER NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  room_type TEXT NOT NULL,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_website_visible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
-- This table stores customer contact form submissions and inquiries
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
-- This table stores gallery images organized by categories for the hotel website
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('attractions', 'neighbourhood', 'foods', 'events')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Bars Table
-- This table stores notification messages displayed on the website
CREATE TABLE notification_bars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
-- This table stores menu item suggestions with detailed information for restaurant management
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner')),
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  preparation_time INTEGER NOT NULL CHECK (preparation_time > 0), -- in minutes
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Images Table
-- This table stores uploaded menu images organized by categories for restaurant display
CREATE TABLE menu_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('drinks', 'desserts', 'others')),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
-- This table stores hotel room booking information and reservations
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
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

-- External Users Table
-- This table stores external users created by admin with limited access to guest management
-- External users can only access guest entry functionality, not the full admin panel
CREATE TABLE external_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'external_user',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guests Table
-- This table stores guest information entered by external users or admin
-- Guests are visitors/customers who may or may not have bookings
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  date_of_birth DATE,
  identification_type TEXT CHECK (identification_type IN ('passport', 'driver_license', 'national_id', 'other')),
  identification_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  special_requirements TEXT,
  notes TEXT,
  is_vip BOOLEAN DEFAULT FALSE,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by_external_user_id UUID REFERENCES external_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure at least one creator is specified
  CONSTRAINT check_creator CHECK (
    (created_by_user_id IS NOT NULL AND created_by_external_user_id IS NULL) OR
    (created_by_user_id IS NULL AND created_by_external_user_id IS NOT NULL)
  )
);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Create triggers for automatic updated_at timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_notification_bars_updated_at
  BEFORE UPDATE ON notification_bars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_menu_images_updated_at
  BEFORE UPDATE ON menu_images
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_external_users_updated_at
  BEFORE UPDATE ON external_users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Rooms table indexes
CREATE INDEX idx_rooms_room_number ON rooms(room_number);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);
CREATE INDEX idx_rooms_capacity ON rooms(capacity);
CREATE INDEX idx_rooms_available ON rooms(is_available);
CREATE INDEX idx_rooms_display_category ON rooms(display_category);
CREATE INDEX idx_rooms_room_type ON rooms(room_type);

-- Contact messages table indexes
CREATE INDEX idx_contact_read ON contact_messages(is_read);
CREATE INDEX idx_contact_email ON contact_messages(email);
CREATE INDEX idx_contact_created_at ON contact_messages(created_at);

-- Gallery images table indexes
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_created_at ON gallery_images(created_at);

-- Notification bars table indexes
CREATE INDEX idx_notification_bars_active ON notification_bars(is_active);
CREATE INDEX idx_notification_bars_dates ON notification_bars(start_date, end_date);
CREATE INDEX idx_notification_bars_type ON notification_bars(type);

-- Menu items table indexes
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_price ON menu_items(price);
CREATE INDEX idx_menu_items_prep_time ON menu_items(preparation_time);
CREATE INDEX idx_menu_items_created_at ON menu_items(created_at);

-- Menu images table indexes
CREATE INDEX idx_menu_images_category ON menu_images(category);
CREATE INDEX idx_menu_images_created_at ON menu_images(created_at);

-- Bookings table indexes
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- External users table indexes
CREATE INDEX idx_external_users_email ON external_users(email);
CREATE INDEX idx_external_users_role ON external_users(role);
CREATE INDEX idx_external_users_is_active ON external_users(is_active);
CREATE INDEX idx_external_users_created_by ON external_users(created_by);

-- Guests table indexes
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_first_name ON guests(first_name);
CREATE INDEX idx_guests_last_name ON guests(last_name);
CREATE INDEX idx_guests_is_vip ON guests(is_vip);
CREATE INDEX idx_guests_created_by_user_id ON guests(created_by_user_id);
CREATE INDEX idx_guests_created_by_external_user_id ON guests(created_by_external_user_id);
CREATE INDEX idx_guests_created_at ON guests(created_at);

-- =============================================================================
-- DEFAULT DATA
-- =============================================================================

-- Insert default admin user
-- Email: project@gmail.com
-- Password: project (hashed using bcrypt)
-- Note: This is a default admin account for initial setup. Change credentials in production.
INSERT INTO users (
  email,
  password,
  first_name,
  last_name,
  role
) VALUES (
  'project@gmail.com',
  '$2b$10$koInpOjeLCMl6gDwhEBmM.cVTI4yAHt7fZvEwbC2ONbydyFhsflWy', -- bcrypt hash for 'project'
  'Admin',
  'User',
  'admin'
) ON CONFLICT (email) DO NOTHING;
