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
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  size_sqm DECIMAL(10, 2) NOT NULL,
  bed_type TEXT NOT NULL,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
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

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Rooms table indexes
CREATE INDEX idx_rooms_price ON rooms(price_per_night);
CREATE INDEX idx_rooms_capacity ON rooms(capacity);
CREATE INDEX idx_rooms_available ON rooms(is_available);
CREATE INDEX idx_rooms_category ON rooms(category);

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
