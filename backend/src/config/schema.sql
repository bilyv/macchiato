-- Database schema for Macchiato Suite Dreams

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  capacity INT NOT NULL,
  size_sqm INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Room amenities table
CREATE TABLE IF NOT EXISTS room_amenities (
  id SERIAL PRIMARY KEY,
  room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotel amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100),
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@macchiato.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V8Kd/4TnudDN.2f/C6', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create sample rooms
INSERT INTO rooms (name, description, price_per_night, capacity, size_sqm, image_url, is_available)
VALUES 
  ('Deluxe Suite', 'Luxurious suite with a stunning view of the city skyline.', 299.99, 2, 45, '/images/rooms/deluxe-suite.jpg', true),
  ('Executive Room', 'Spacious room with a comfortable work area and premium amenities.', 199.99, 2, 35, '/images/rooms/executive-room.jpg', true),
  ('Family Suite', 'Perfect for families, with separate living area and two bedrooms.', 399.99, 4, 65, '/images/rooms/family-suite.jpg', true)
ON CONFLICT DO NOTHING;

-- Create sample amenities
INSERT INTO amenities (name, description, icon, image_url)
VALUES 
  ('Swimming Pool', 'Relax in our temperature-controlled indoor swimming pool.', 'pool', '/images/amenities/pool.jpg'),
  ('Fitness Center', 'Stay fit with our state-of-the-art fitness equipment.', 'fitness', '/images/amenities/fitness.jpg'),
  ('Spa', 'Indulge in a variety of treatments at our luxury spa.', 'spa', '/images/amenities/spa.jpg')
ON CONFLICT DO NOTHING;
