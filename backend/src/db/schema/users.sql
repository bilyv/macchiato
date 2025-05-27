-- Users Table Schema
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

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

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
