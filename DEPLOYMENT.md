# Deployment Guide for Macchiato Suite Dreams

## Vercel Deployment Fix for SPA Routing

This guide explains how to fix the 404 errors when reloading pages on Vercel.

### Problem
When you navigate to routes like `/menu` directly or reload the page, Vercel returns a 404 error because it tries to find a physical file at that path, but React Router handles these routes client-side.

### Solution
We've implemented the following fixes:

#### 1. vercel.json Configuration
The `vercel.json` file tells Vercel to serve `index.html` for all routes:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "installCommand": "bun install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

**Key additions for fixing the "No Output Directory" error:**
- `"buildCommand": "bun run build"` - Tells Vercel how to build the project
- `"outputDirectory": "dist"` - Specifies where the build output is located
- `"installCommand": "bun install"` - Tells Vercel to use bun instead of npm
- `"framework": "vite"` - Helps Vercel optimize for Vite projects

#### 2. _redirects File (Backup)
We've also added a `public/_redirects` file as a fallback:

```
/*    /index.html   200
```

#### 3. Vite Configuration
Updated `vite.config.ts` to ensure proper SPA build:

```typescript
build: {
  // Ensure proper build output for SPA
  rollupOptions: {
    output: {
      manualChunks: undefined,
    },
  },
},
```

### Deployment Steps

1. **Build the project:**
   ```bash
   bun run build
   ```

2. **Deploy to Vercel:**
   - Push your changes to your Git repository
   - Vercel will automatically redeploy
   - Or use Vercel CLI: `vercel --prod`

3. **Test the fix:**
   - Navigate to your deployed site
   - Go to any route (e.g., `/menu`)
   - Reload the page - it should work without 404 errors

### Files Modified
- ✅ `vercel.json` - Created with rewrite rules
- ✅ `public/_redirects` - Created as backup
- ✅ `vite.config.ts` - Updated build configuration

### Verification
After deployment, test these URLs directly:
- `https://your-domain.vercel.app/menu`
- `https://your-domain.vercel.app/rooms`
- `https://your-domain.vercel.app/about-us`
- `https://your-domain.vercel.app/gallery`
- `https://your-domain.vercel.app/contact`

All should load correctly without 404 errors.

### Troubleshooting
If you still get 404 errors:
1. Check that `vercel.json` is in the root directory
2. Ensure the build completed successfully
3. Clear browser cache and try again
4. Check Vercel deployment logs for any errors
