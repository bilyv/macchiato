-- Guests Table Schema
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
CREATE INDEX idx_guests_is_vip ON guests(is_vip);
CREATE INDEX idx_guests_created_by_user_id ON guests(created_by_user_id);
CREATE INDEX idx_guests_created_by_external_user_id ON guests(created_by_external_user_id);
CREATE INDEX idx_guests_created_at ON guests(created_at);
