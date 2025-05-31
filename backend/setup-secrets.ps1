# PowerShell script to set up Cloudflare Workers secrets
# Run this after authenticating with wrangler login

Write-Host "Setting up Cloudflare Workers secrets..." -ForegroundColor Green

# Read environment variables from .env file
$envFile = Get-Content .env
$envVars = @{}

foreach ($line in $envFile) {
    if ($line -match '^([^#][^=]+)=(.*)$') {
        $envVars[$matches[1]] = $matches[2]
    }
}

Write-Host "Setting SUPABASE_URL..." -ForegroundColor Yellow
$envVars['SUPABASE_URL'] | npx wrangler secret put SUPABASE_URL

Write-Host "Setting SUPABASE_ANON_KEY..." -ForegroundColor Yellow
$envVars['SUPABASE_ANON_KEY'] | npx wrangler secret put SUPABASE_ANON_KEY

Write-Host "Setting JWT_SECRET..." -ForegroundColor Yellow
$envVars['JWT_SECRET'] | npx wrangler secret put JWT_SECRET

Write-Host "Setting CLOUDINARY_CLOUD_NAME..." -ForegroundColor Yellow
$envVars['CLOUDINARY_CLOUD_NAME'] | npx wrangler secret put CLOUDINARY_CLOUD_NAME

Write-Host "Setting CLOUDINARY_API_KEY..." -ForegroundColor Yellow
$envVars['CLOUDINARY_API_KEY'] | npx wrangler secret put CLOUDINARY_API_KEY

Write-Host "Setting CLOUDINARY_API_SECRET..." -ForegroundColor Yellow
$envVars['CLOUDINARY_API_SECRET'] | npx wrangler secret put CLOUDINARY_API_SECRET

Write-Host "All secrets have been set up!" -ForegroundColor Green
Write-Host "You can now deploy with: bun run deploy" -ForegroundColor Cyan
