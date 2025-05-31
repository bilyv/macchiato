# Connecting Vercel Frontend to Render Backend

This guide explains how to connect your Vercel-deployed frontend to your Render-deployed backend.

## Current Setup

- **Frontend**: Deployed on Vercel at `https://macchiato-delta.vercel.app/`
- **Backend**: Deployed on Render at `https://macchiato.onrender.com/`

## Configuration Steps

### 1. Frontend Configuration (Vercel)

The frontend now uses environment variables to determine the backend URL:

- **Development**: Uses Vite proxy (`/api` → `http://localhost:3000`)
- **Production**: Uses `VITE_BACKEND_URL` environment variable

### 2. Environment Variables

#### For Vercel Deployment:
Set the following environment variable in your Vercel project settings:

```
VITE_BACKEND_URL=https://macchiato.onrender.com
```

#### For Local Development:
Create a `.env.local` file (optional):

```
# Leave empty to use Vite proxy for local development
VITE_BACKEND_URL=
```

### 3. Backend Configuration (Render)

The backend is configured to accept requests from:

- `http://localhost:8080` (local development)
- `https://macchiato-delta.vercel.app` (Vercel frontend)
- Any additional origin set via `CORS_ORIGIN` environment variable

### 4. Deployment Steps

#### Backend (Render):
1. Build the TypeScript code: `cd backend && bun run build`
2. Deploy to Render (automatic on git push)
3. Verify the backend is running at `https://macchiato.onrender.com/`

#### Frontend (Vercel):
1. Set the `VITE_BACKEND_URL` environment variable in Vercel dashboard
2. Redeploy the frontend (automatic on git push)
3. Verify the frontend can connect to the backend

### 5. Testing the Connection

1. Visit your Vercel frontend: `https://macchiato-delta.vercel.app/`
2. Open browser developer tools (F12)
3. Check the Network tab for API requests
4. API requests should go to `https://macchiato.onrender.com/api/*`

### 6. Troubleshooting

#### CORS Errors:
- Check that your Vercel URL is in the backend's allowed origins
- Verify the `CORS_ORIGIN` environment variable in Render

#### API Connection Errors:
- Verify `VITE_BACKEND_URL` is set correctly in Vercel
- Check that the backend is running at `https://macchiato.onrender.com/`
- Test the backend directly by visiting `https://macchiato.onrender.com/health`

#### Environment Variables:
- In Vercel: Go to Project Settings → Environment Variables
- In Render: Go to Service Settings → Environment Variables

## Environment Variable Summary

### Vercel (Frontend):
```
VITE_BACKEND_URL=https://macchiato.onrender.com
```

### Render (Backend):
```
PORT=3000 (automatically set by Render)
HOST=0.0.0.0 (automatically set)
CORS_ORIGIN=https://macchiato-delta.vercel.app (optional, already hardcoded)
```

## API Endpoints

Once connected, your frontend can access:

- Health check: `https://macchiato.onrender.com/health`
- Authentication: `https://macchiato.onrender.com/api/auth`
- Rooms: `https://macchiato.onrender.com/api/rooms`
- Gallery: `https://macchiato.onrender.com/api/gallery`
- Menu: `https://macchiato.onrender.com/api/menu`
- Contact: `https://macchiato.onrender.com/api/contact`
- Notifications: `https://macchiato.onrender.com/api/notification-bars`
