-- Notification Bars Table Schema
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

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_notification_bars_updated_at
  BEFORE UPDATE ON notification_bars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_notification_bars_active ON notification_bars(is_active);
CREATE INDEX idx_notification_bars_dates ON notification_bars(start_date, end_date);
CREATE INDEX idx_notification_bars_type ON notification_bars(type);
