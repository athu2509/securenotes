# Project Cleanup Script for Secure Notes
# This script removes development artifacts and prepares the project for sharing

Write-Host "Cleaning up Secure Notes project for distribution..." -ForegroundColor Green

# Remove development artifacts and caches
$pathsToRemove = @(
    "backend\node_modules",
    "frontend\node_modules", 
    "backend\.env",
    "frontend\.env",
    "backend\package-lock.json",
    "frontend\package-lock.json",
    ".vscode",
    "backend\.nodemonrc",
    "frontend\.env.local",
    "frontend\.env.development.local",
    "frontend\.env.test.local",
    "frontend\.env.production.local",
    "frontend\build",
    "backend\logs",
    "*.log",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    ".DS_Store",
    "Thumbs.db"
)

foreach ($path in $pathsToRemove) {
    if (Test-Path $path) {
        Write-Host "Removing: $path" -ForegroundColor Yellow
        Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Update package.json files to remove any timestamps or personal info
Write-Host "Updating package.json files..." -ForegroundColor Yellow

# Backend package.json cleanup
$backendPackageJson = Get-Content "backend\package.json" | ConvertFrom-Json
$backendPackageJson.version = "1.0.0"
$backendPackageJson.description = "Backend API for Secure Notes application with encrypted storage"
$backendPackageJson | ConvertTo-Json -Depth 10 | Set-Content "backend\package.json"

# Frontend package.json cleanup  
$frontendPackageJson = Get-Content "frontend\package.json" | ConvertFrom-Json
$frontendPackageJson.version = "1.0.0" 
$frontendPackageJson.name = "secure-notes-frontend"
$frontendPackageJson.description = "React frontend for Secure Notes application with client-side encryption"
$frontendPackageJson | ConvertTo-Json -Depth 10 | Set-Content "frontend\package.json"

# Create clean environment template files
Write-Host "Creating environment template files..." -ForegroundColor Yellow

# Backend .env template
@"
# Backend Environment Configuration
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/secure-notes
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
CLIENT_URL=http://localhost:3001
"@ | Set-Content "backend\.env.template"

# Frontend .env template
@"
# Frontend Environment Configuration  
REACT_APP_API_URL=http://localhost:5001/api
"@ | Set-Content "frontend\.env.template"

# Create installation script
Write-Host "Creating installation script..." -ForegroundColor Yellow

@"
# Secure Notes - Installation Guide

## Quick Setup

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local installation or Atlas cloud service)

### Installation Steps

1. **Clone or extract the project files**

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.template .env
   # Edit .env file with your MongoDB URI and secure JWT secret
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   cp .env.template .env
   # Edit .env file if needed (default API URL should work)
   ```

4. **Start the Application:**
   
   Backend (in backend folder):
   ```bash
   npm run dev
   ```
   
   Frontend (in frontend folder):
   ```bash
   npm start
   ```

5. **Access the application at:** http://localhost:3001

## Environment Configuration

### Backend (.env)
- PORT: Server port (default: 5001)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secure secret for JWT tokens (minimum 32 characters)
- CLIENT_URL: Frontend URL for CORS

### Frontend (.env) 
- REACT_APP_API_URL: Backend API URL

## Security Notes
- Change the JWT_SECRET to a strong, unique value
- Use HTTPS in production
- Configure MongoDB with authentication
- Review firewall and security group settings for production deployment
"@ | Set-Content "INSTALLATION.md"

Write-Host "Project cleanup completed!" -ForegroundColor Green
Write-Host "Ready for distribution - all development artifacts removed" -ForegroundColor Green
Write-Host "Don't forget to:" -ForegroundColor Cyan
Write-Host "  1. Review the README.md file" -ForegroundColor Cyan  
Write-Host "  2. Test the installation process" -ForegroundColor Cyan
Write-Host "  3. Create your distribution package" -ForegroundColor Cyan
