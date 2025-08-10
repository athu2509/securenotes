# Secure Notes - Installation Guide

## Quick Setup

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local installation or Atlas cloud service)

### Installation Steps

1. **Clone or extract the project files**

2. **Backend Setup:**
   `ash
   cd backend
   npm install
   cp .env.template .env
   # Edit .env file with your MongoDB URI and secure JWT secret
   `

3. **Frontend Setup:**
   `ash
   cd ../frontend
   npm install
   cp .env.template .env
   # Edit .env file if needed (default API URL should work)
   `

4. **Start the Application:**
   
   Backend (in backend folder):
   `ash
   npm run dev
   `
   
   Frontend (in frontend folder):
   `ash
   npm start
   `

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
