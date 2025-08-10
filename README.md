# Secure Notes Application
<!-- Original concept by asifa -->

A secure notes app with client-side encryption, built with React, Node.js, and MongoDB.

## Features

- Secure Authentication with JWT and bcrypt password hashing
- Create, edit, and delete encrypted notes
- Client-side AES-256 encryption
- Responsive design

## Tech Stack

- **Frontend**: React with TypeScript, CryptoJS
- **Backend**: Node.js, Express, MongoDB
- **Security**: JWT, bcrypt, rate limiting

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. **Clone repository**
```bash
git clone https://github.com/athu2509/securenotes.git
cd securenotes
```

2. **Backend setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/securenotes
JWT_SECRET=your-secure-secret-key
PORT=5001
```

3. **Frontend setup**
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Running the App

Start backend:
```bash
cd backend && npm start
```

Start frontend:
```bash
cd frontend && npm start
```

Visit `http://localhost:3000`

## API Endpoints

**Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

**Notes**
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Security Features

- Client-side AES-256 encryption
- Password hashing with bcrypt
- JWT authentication
- Rate limiting protection
- Input validation
