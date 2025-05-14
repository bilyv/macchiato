# Macchiato Suite Dreams Backend

This is the backend API for the Macchiato Suite Dreams hotel booking system. It provides endpoints for managing rooms, bookings, amenities, and user authentication.

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Strongly typed programming language
- **PostgreSQL**: Relational database (using Neon serverless Postgres)
- **JWT**: JSON Web Tokens for authentication

## Features

- User authentication and authorization
- Room management
- Booking system
- Amenities management
- Contact form submission and management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- Neon PostgreSQL account (or any PostgreSQL database)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Create a `.env` file based on `.env.example` and add your database credentials:
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:8080
   ```
5. Build the project:
   ```bash
   bun run build
   ```
6. Start the server:
   ```bash
   bun run start
   ```

For development with hot-reloading:
```bash
bun run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room (admin only)
- `PUT /api/rooms/:id` - Update a room (admin only)
- `DELETE /api/rooms/:id` - Delete a room (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (admin) or user bookings
- `GET /api/bookings/:id` - Get a specific booking
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id/status` - Update booking status (admin only)
- `PATCH /api/bookings/:id/cancel` - Cancel a booking

### Amenities
- `GET /api/amenities` - Get all amenities
- `GET /api/amenities/:id` - Get a specific amenity
- `POST /api/amenities` - Create a new amenity (admin only)
- `PUT /api/amenities/:id` - Update an amenity (admin only)
- `DELETE /api/amenities/:id` - Delete an amenity (admin only)

### Contact
- `POST /api/contact` - Submit a contact form
- `GET /api/contact` - Get all contact messages (admin only)
- `GET /api/contact/:id` - Get a specific contact message (admin only)
- `PATCH /api/contact/:id/read` - Mark a contact message as read (admin only)
- `DELETE /api/contact/:id` - Delete a contact message (admin only)

## Database Schema

The database consists of the following tables:
- `users` - User accounts
- `rooms` - Hotel rooms
- `bookings` - Room bookings
- `amenities` - Hotel amenities
- `room_amenities` - Junction table for room-amenity relationships
- `contact_messages` - Contact form submissions

## Testing

Run tests with:
```bash
bun run test
```

Run tests in watch mode:
```bash
bun run test:watch
```
