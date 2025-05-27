-- Menu Images Table Schema
-- This table stores uploaded menu images organized by categories for restaurant display

CREATE TABLE menu_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('drinks', 'desserts', 'others')),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_menu_images_updated_at
  BEFORE UPDATE ON menu_images
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_menu_images_category ON menu_images(category);
CREATE INDEX idx_menu_images_created_at ON menu_images(created_at);

-- Add comments for documentation
COMMENT ON TABLE menu_images IS 'Stores uploaded menu images organized by categories for restaurant display';
COMMENT ON COLUMN menu_images.id IS 'Unique identifier for each menu image';
COMMENT ON COLUMN menu_images.title IS 'Title or name of the menu image';
COMMENT ON COLUMN menu_images.category IS 'Category of the menu image: drinks, desserts, or others';
COMMENT ON COLUMN menu_images.image_url IS 'URL of the uploaded menu image';
COMMENT ON COLUMN menu_images.created_at IS 'Timestamp when the menu image was uploaded';
COMMENT ON COLUMN menu_images.updated_at IS 'Timestamp when the menu image was last updated';
