-- Guests Table Schema
-- This table stores guest information entered by external users or admin
-- Guests are visitors/customers who may or may not have bookings
-- Includes booking details for local guests without formal bookings

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  country TEXT,
  date_of_birth DATE,
  identification_type TEXT CHECK (identification_type IN ('passport', 'driver_license', 'national_id', 'other')),
  identification_number TEXT,
  special_requirements TEXT,
  -- Booking details for local guests
  room_number INTEGER,
  check_in_date DATE,
  check_out_date DATE,
  number_of_guests INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2),
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by_external_user_id UUID REFERENCES external_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure at least one creator is specified
  CONSTRAINT check_creator CHECK (
    (created_by_user_id IS NOT NULL AND created_by_external_user_id IS NULL) OR
    (created_by_user_id IS NULL AND created_by_external_user_id IS NOT NULL)
  ),

  -- Ensure booking details are consistent
  CONSTRAINT check_booking_dates CHECK (
    (check_in_date IS NULL AND check_out_date IS NULL) OR
    (check_in_date IS NOT NULL AND check_out_date IS NOT NULL AND check_out_date > check_in_date)
  ),

  -- Ensure number of guests is positive
  CONSTRAINT check_number_of_guests CHECK (number_of_guests > 0)
);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_first_name ON guests(first_name);
CREATE INDEX idx_guests_last_name ON guests(last_name);
CREATE INDEX idx_guests_room_number ON guests(room_number);
CREATE INDEX idx_guests_check_in_date ON guests(check_in_date);
CREATE INDEX idx_guests_check_out_date ON guests(check_out_date);
CREATE INDEX idx_guests_created_by_user_id ON guests(created_by_user_id);
CREATE INDEX idx_guests_created_by_external_user_id ON guests(created_by_external_user_id);
CREATE INDEX idx_guests_created_at ON guests(created_at);
