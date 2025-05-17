-- Drop the page_contents table
DROP TABLE IF EXISTS page_contents;

-- Drop the trigger for page_contents
DROP TRIGGER IF EXISTS update_page_contents_updated_at ON page_contents;

-- Drop the index for page_contents
DROP INDEX IF EXISTS idx_page_contents_page;

-- Note: We're keeping the notification_bars table and its related objects
