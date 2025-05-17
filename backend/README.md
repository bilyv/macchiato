# Macchiato Suite Dreams Backend

This is the backend API for the Macchiato Suite Dreams hotel website, built with Express, TypeScript, and PostgreSQL.

## Features

- User authentication and authorization with JWT
- RESTful API for hotel operations
- Room management
- Booking system
- Amenities management
- Contact form submission handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- PostgreSQL database

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file based on `.env.example` and add your PostgreSQL credentials:
   ```
   PGHOST=localhost
   PGUSER=postgres
   PGDATABASE=macchiato_suites
   PGPASSWORD=your_password
   PGPORT=5432
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

## Setting Up PostgreSQL Database

1. Install PostgreSQL on your local machine or use a cloud-hosted PostgreSQL service

2. Create a new database named `macchiato_suites`

3. Set up the following tables in your PostgreSQL database:

### Users Table

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
```

### Rooms Table

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  size_sqm DECIMAL(10, 2) NOT NULL,
  bed_type TEXT NOT NULL,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Amenities Table

```sql
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contact Messages Table

```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register a new user
- `GET /api/auth/profile` - Get current user profile

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create a new room (admin only)
- `PUT /api/rooms/:id` - Update a room (admin only)
- `DELETE /api/rooms/:id` - Delete a room (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (admin) or user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id/status` - Update booking status (admin only)
- `PATCH /api/bookings/:id/cancel` - Cancel a booking

### Amenities
- `GET /api/amenities` - Get all amenities
- `GET /api/amenities/:id` - Get amenity by ID
- `POST /api/amenities` - Create a new amenity (admin only)
- `PUT /api/amenities/:id` - Update an amenity (admin only)
- `DELETE /api/amenities/:id` - Delete an amenity (admin only)

### Contact
- `GET /api/contact` - Get all contact messages (admin only)
- `GET /api/contact/:id` - Get contact message by ID (admin only)
- `POST /api/contact` - Submit a contact message
- `PATCH /api/contact/:id/read` - Mark message as read (admin only)
- `DELETE /api/contact/:id` - Delete a message (admin only)

## License

This project is licensed under the ISC License.
