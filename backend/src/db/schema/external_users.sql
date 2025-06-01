-- External Users Table Schema
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

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_external_users_updated_at
  BEFORE UPDATE ON external_users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_external_users_email ON external_users(email);
CREATE INDEX idx_external_users_role ON external_users(role);
CREATE INDEX idx_external_users_is_active ON external_users(is_active);
CREATE INDEX idx_external_users_created_by ON external_users(created_by);
