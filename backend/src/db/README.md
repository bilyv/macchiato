# Database Schema Documentation

This directory contains the complete database schema for the Macchiato Suites hotel management system.

## File Structure

```
backend/src/db/
├── main.sql                    # Complete database schema (all tables, functions, triggers, indexes)
├── schema/                     # Individual table schema files
│   ├── extensions.sql          # PostgreSQL extensions
│   ├── functions.sql           # Database functions and triggers
│   ├── users.sql              # Users table schema
│   ├── rooms.sql              # Rooms table schema
│   ├── contact_messages.sql   # Contact messages table schema
│   ├── gallery_images.sql     # Gallery images table schema
│   ├── notification_bars.sql  # Notification bars table schema
│   ├── menu_items.sql         # Menu items table schema
│   └── menu_images.sql        # Menu images table schema
└── README.md                  # This documentation file
```

## Database Tables

### 1. Users (`users`)
- **Purpose**: Stores user authentication and profile information
- **Key Fields**: id, email, password, first_name, last_name, role
- **Indexes**: email, role

### 2. Rooms (`rooms`)
- **Purpose**: Stores hotel room information including pricing, amenities, and availability
- **Key Fields**: id, name, description, price_per_night, capacity, size_sqm, bed_type, amenities, category
- **Indexes**: price_per_night, capacity, is_available, category

### 3. Contact Messages (`contact_messages`)
- **Purpose**: Stores customer contact form submissions and inquiries
- **Key Fields**: id, name, email, subject, message, phone, is_read
- **Indexes**: is_read, email, created_at

### 4. Gallery Images (`gallery_images`)
- **Purpose**: Stores gallery images organized by categories for the hotel website
- **Key Fields**: id, image_url, title, description, category
- **Categories**: attractions, neighbourhood, foods, events
- **Indexes**: category, created_at

### 5. Notification Bars (`notification_bars`)
- **Purpose**: Stores notification messages displayed on the website
- **Key Fields**: id, message, type, is_active, start_date, end_date
- **Types**: info, warning, success, error
- **Indexes**: is_active, dates, type

### 6. Menu Items (`menu_items`)
- **Purpose**: Stores menu item suggestions with detailed information for restaurant management
- **Key Fields**: id, item_name, category, description, price, preparation_time, tags, image_url
- **Categories**: breakfast, lunch, dinner
- **Indexes**: category, price, preparation_time, created_at

### 7. Menu Images (`menu_images`)
- **Purpose**: Stores uploaded menu images organized by categories for restaurant display
- **Key Fields**: id, title, category, image_url
- **Categories**: drinks, desserts, others
- **Indexes**: category, created_at

## Database Setup

### Using the Complete Schema
To set up the entire database, run the main schema file:

```sql
\i backend/src/db/main.sql
```

### Using Individual Schema Files
To set up tables individually, run the schema files in this order:

1. `extensions.sql` - PostgreSQL extensions
2. `functions.sql` - Database functions
3. `users.sql` - Users table
4. `rooms.sql` - Rooms table
5. `contact_messages.sql` - Contact messages table
6. `gallery_images.sql` - Gallery images table
7. `notification_bars.sql` - Notification bars table
8. `menu_items.sql` - Menu items table
9. `menu_images.sql` - Menu images table

## Features

- **UUID Primary Keys**: All tables use UUID for primary keys
- **Automatic Timestamps**: All tables have created_at and updated_at timestamps
- **Automatic Updates**: updated_at timestamps are automatically updated via triggers
- **Performance Indexes**: Optimized indexes for common queries
- **Data Validation**: Check constraints for enum-like fields
- **Comments**: Comprehensive documentation for all schema elements

## Notes

- All timestamps are stored with timezone information
- The schema includes proper error handling and data validation
- Indexes are optimized for the application's query patterns
- The schema follows PostgreSQL best practices
