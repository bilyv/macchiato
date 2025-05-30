# Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend to Vercel and configure them to work together.

## Current Setup

- **Frontend URL**: https://macchiato-delta.vercel.app/
- **Backend URL**: https://macchiato-3q7t.vercel.app/

## Environment Variables Configuration

### Frontend Environment Variables

The frontend uses environment variables to determine the API base URL:

- **Development**: Uses Vite proxy (`/api` → `http://localhost:3000`)
- **Production**: Uses direct backend URL (`https://macchiato-3q7t.vercel.app`)

### Backend Environment Variables

The backend is configured to accept requests from both development and production frontend URLs:

```
CORS_ORIGIN=http://localhost:8080,https://macchiato-delta.vercel.app
```

## Deployment Steps

### Frontend Deployment

1. **Environment Variables in Vercel Dashboard**:
   - Go to your frontend project in Vercel
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     ```
     VITE_API_BASE_URL=https://macchiato-3q7t.vercel.app
     VITE_NODE_ENV=production
     VITE_FRONTEND_URL=https://macchiato-delta.vercel.app
     ```

2. **Build and Deploy**:
   ```bash
   # Build the frontend
   bun run build
   
   # Deploy to Vercel (if using CLI)
   vercel --prod
   ```

### Backend Deployment

1. **Environment Variables in Vercel Dashboard**:
   - Go to your backend project in Vercel
   - Navigate to Settings → Environment Variables
   - Add all the variables from `backend/.env`:
     ```
     SUPABASE_URL=https://whiijcszqrggkesbfjdg.supabase.co
     SUPABASE_ANON_KEY=your_supabase_anon_key
     DATABASE_URL=your_database_url
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=http://localhost:8080,https://macchiato-delta.vercel.app
     CLOUDINARY_CLOUD_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_cloudinary_key
     CLOUDINARY_API_SECRET=your_cloudinary_secret
     # ... add all other environment variables
     ```

2. **Build and Deploy**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Build the backend
   bun run build
   
   # Deploy to Vercel (if using CLI)
   vercel --prod
   ```

## Testing the Connection

After deployment, test the connection:

1. **Frontend Health Check**: Visit https://macchiato-delta.vercel.app/
2. **Backend Health Check**: Visit https://macchiato-3q7t.vercel.app/health
3. **API Connection**: Try logging into the admin panel at https://macchiato-delta.vercel.app/admin/login

## Troubleshooting

### CORS Issues
- Ensure `CORS_ORIGIN` in backend includes the frontend URL
- Check browser console for CORS errors

### API Connection Issues
- Verify `VITE_API_BASE_URL` points to the correct backend URL
- Check network tab in browser dev tools for failed requests

### Environment Variables
- Ensure all required environment variables are set in Vercel dashboard
- Redeploy after adding/changing environment variables

## Files Modified

- ✅ `src/lib/api/core.ts` - Dynamic API base URL
- ✅ `.env` - Development environment variables
- ✅ `.env.production` - Production environment variables
- ✅ `vite.config.ts` - Conditional proxy configuration
- ✅ `backend/.env` - Updated CORS origins
- ✅ `backend/src/index.ts` - Multiple CORS origins support
- ✅ `backend/vercel.json` - Backend Vercel configuration
- ✅ `src/hooks/useAuth.tsx` - Use dynamic API URL
- ✅ `.gitignore` - Ignore local environment files
