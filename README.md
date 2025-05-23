# Macchiato Suite Dreams

## Project Overview

Macchiato Suite Dreams is a luxury hotel website built with modern web technologies. The website showcases the hotel's elegant accommodations, amenities, and services, providing potential guests with a seamless browsing experience to explore and book their stay.

## Technology Stack

### Frontend
- **Vite**: Fast, modern frontend build tool
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **React**: JavaScript library for building user interfaces
- **shadcn-ui**: Beautifully designed components built with Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Strongly typed programming language
- **PostgreSQL**: Open-source relational database
- **JWT**: JSON Web Tokens for authentication

## Features

### Frontend
- Responsive design that works on all devices
- Elegant UI with smooth animations and transitions
- Interactive room gallery with detailed information
- Amenities showcase
- Contact form

### Backend
- RESTful API for hotel operations
- User authentication and authorization
- Room management system
- Booking system with availability checking
- Amenities management
- Contact form submission handling
- Direct PostgreSQL database integration

## Project Structure

The project follows a clean, modular architecture:

### Frontend (`/`)
- `src/components`: Reusable UI components
- `src/pages`: Page components for different routes
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and shared code

### Backend (`/backend`)
- `src/controllers`: API endpoint controllers
- `src/routes`: API route definitions
- `src/middleware`: Express middleware
- `src/config`: Configuration files
- `src/models`: Data models and database interactions

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- PostgreSQL database

### Frontend Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd macchiato-suite-dreams

# Install dependencies
bun install

# Start the development server
bun run dev
```

### Backend Installation

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
bun install

# Create a .env file based on .env.example and add your PostgreSQL credentials
# PGHOST=localhost
# PGUSER=postgres
# PGDATABASE=macchiato_suites
# PGPASSWORD=your_password
# PGPORT=5432
# JWT_SECRET=your_jwt_secret

# Start the development server
bun run dev
```

### PostgreSQL Setup

1. Install PostgreSQL on your local machine or use a cloud-hosted PostgreSQL service
2. Create a new database named `macchiato_suites`
3. Run the SQL commands from `backend/schema.sql` to set up the database schema
4. Add your PostgreSQL credentials to the `.env` file in the backend directory

### Quick Start (Windows)

For Windows users, we've included batch files to quickly start the application:

1. Run `start-frontend.bat` to start the frontend development server
2. Run `backend\start-backend.bat` to start the backend development server

## Building for Production

### Frontend

```bash
# Build the frontend
bun run build

# Preview the production build
bun run preview
```

### Backend

```bash
# Build the backend
cd backend
bun run build

# Start the production server
bun run start
```

## Design Philosophy

The design of Macchiato Suite Dreams emphasizes elegance, luxury, and comfort. The color palette features warm, earthy tones that evoke the rich colors of coffee and create a welcoming atmosphere. Typography combines serif fonts for headings (Playfair Display) with sans-serif (Poppins) for body text, creating a sophisticated yet readable experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
