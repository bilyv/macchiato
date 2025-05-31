#!/bin/bash

# Script to set up Cloudflare Workers secrets
# Run this after authenticating with wrangler login

echo "Setting up Cloudflare Workers secrets..."

# Read from .env file and set secrets
source .env

echo "Setting SUPABASE_URL..."
echo "$SUPABASE_URL" | npx wrangler secret put SUPABASE_URL

echo "Setting SUPABASE_ANON_KEY..."
echo "$SUPABASE_ANON_KEY" | npx wrangler secret put SUPABASE_ANON_KEY

echo "Setting JWT_SECRET..."
echo "$JWT_SECRET" | npx wrangler secret put JWT_SECRET

echo "Setting CLOUDINARY_CLOUD_NAME..."
echo "$CLOUDINARY_CLOUD_NAME" | npx wrangler secret put CLOUDINARY_CLOUD_NAME

echo "Setting CLOUDINARY_API_KEY..."
echo "$CLOUDINARY_API_KEY" | npx wrangler secret put CLOUDINARY_API_KEY

echo "Setting CLOUDINARY_API_SECRET..."
echo "$CLOUDINARY_API_SECRET" | npx wrangler secret put CLOUDINARY_API_SECRET

echo "All secrets have been set up!"
echo "You can now deploy with: bun run deploy"
