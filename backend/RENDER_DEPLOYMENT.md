# Render Deployment Guide for Macchiato Suites Backend

## Overview
This guide explains how to deploy the Macchiato Suites backend to Render using the updated configuration.

## Prerequisites
- Render account
- GitHub repository with your backend code
- PostgreSQL database on Render (already configured)

## Database Configuration
Your PostgreSQL database is already set up with:
- **Database Name**: `macchiato_3xko`
- **Username**: `macchiato_3xko_user`
- **Connection String**: `postgresql://macchiato_3xko_user:tzwVzj3dY4jj8FCvm6QH9DXs7H7KoPz3@dpg-d0sqo1mmcj7s73fa2u20-a/macchiato_3xko`

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Configure backend for Render deployment"
git push origin main
```

### 2. Create Web Service on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: Select your GitHub repository
4. **Configure Service**:
   - **Name**: `macchiato-suites-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)` (same as your database)
   - **Branch**: `main`
   - **Root Directory**: `backend`

### 3. Build & Start Commands
```bash
# Build Command
npm install && npm run build

# Start Command
npm start
```

### 4. Environment Variables
Add these environment variables in Render:

#### Required Variables:
```
NODE_ENV=production
DATABASE_URL=postgresql://macchiato_3xko_user:tzwVzj3dY4jj8FCvm6QH9DXs7H7KoPz3@dpg-d0sqo1mmcj7s73fa2u20-a/macchiato_3xko
JWT_SECRET=macchiato_suites_jwt_secret_key_2024_secure_token_for_authentication
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://macchiato-delta.vercel.app
```

#### Optional Variables (for image uploads):
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Advanced Settings
- **Health Check Path**: `/health`
- **Auto-Deploy**: `Yes`

## Post-Deployment

### 1. Test the Deployment
Once deployed, test these endpoints:

```bash
# Health check
curl https://your-backend-app.onrender.com/health

# API info
curl https://your-backend-app.onrender.com/

# Test rooms endpoint
curl https://your-backend-app.onrender.com/api/rooms
```

### 2. Update Frontend Configuration
Update your frontend's API base URL to point to your Render backend:

```typescript
// In your frontend .env or config
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

### 3. CORS Configuration
The backend is now configured to accept requests from your Vercel frontend at `https://macchiato-delta.vercel.app`.

## Database Schema Deployment

### Option 1: Manual SQL Execution
1. Connect to your Render PostgreSQL database
2. Run your `main.sql` file to create tables

### Option 2: Migration Script (Recommended)
Create a migration endpoint in your backend:

```typescript
// Add to your routes
app.post('/api/admin/migrate', async (req, res) => {
  // Run your SQL migrations here
  // Only enable this in development or with proper authentication
});
```

## Monitoring & Logs

### View Logs
```bash
# In Render dashboard
Services → Your Service → Logs
```

### Health Monitoring
The `/health` endpoint provides:
- Server status
- Database connectivity
- Environment information
- Timestamp

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DATABASE_URL is correct
   - Verify database is in same region
   - Check SSL configuration

2. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check TypeScript compilation errors
   - Verify Node.js version compatibility

3. **CORS Errors**
   - Update CORS_ORIGIN with correct frontend URL
   - Check allowed origins in server configuration

4. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure sensitive values are properly escaped

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **JWT Secret**: Use a strong, unique secret for production
3. **Database**: Ensure SSL is enabled (already configured)
4. **CORS**: Only allow trusted origins
5. **Rate Limiting**: Consider implementing rate limiting for production

## Performance Optimization

1. **Connection Pooling**: Already configured with pg Pool
2. **Compression**: Consider adding gzip compression
3. **Caching**: Implement Redis for session storage if needed
4. **CDN**: Use Cloudinary for image optimization

## Backup Strategy

1. **Database**: Render provides automatic backups for paid plans
2. **Code**: Keep your Git repository as source of truth
3. **Environment**: Document all environment variables

Your backend is now ready for production deployment on Render!
