-- Menu Items Table Schema
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

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_price ON menu_items(price);
CREATE INDEX idx_menu_items_prep_time ON menu_items(preparation_time);
CREATE INDEX idx_menu_items_created_at ON menu_items(created_at);

-- Add comments for documentation
COMMENT ON TABLE menu_items IS 'Stores menu item suggestions with detailed information including pricing, preparation time, and categorization';
COMMENT ON COLUMN menu_items.id IS 'Unique identifier for each menu item';
COMMENT ON COLUMN menu_items.item_name IS 'Name of the menu item';
COMMENT ON COLUMN menu_items.category IS 'Category of the menu item: breakfast, lunch, or dinner';
COMMENT ON COLUMN menu_items.description IS 'Detailed description of the menu item';
COMMENT ON COLUMN menu_items.price IS 'Price of the menu item in decimal format';
COMMENT ON COLUMN menu_items.preparation_time IS 'Time required to prepare the item in minutes';
COMMENT ON COLUMN menu_items.tags IS 'Array of tags associated with the menu item for categorization and search';
COMMENT ON COLUMN menu_items.image_url IS 'URL of the menu item image (optional)';
COMMENT ON COLUMN menu_items.created_at IS 'Timestamp when the menu item was created';
COMMENT ON COLUMN menu_items.updated_at IS 'Timestamp when the menu item was last updated';
