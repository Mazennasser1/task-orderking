# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free tier available)
- Gmail account with 2-Factor Authentication enabled

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=2025

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskorderking

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and update `MONGODB_URI`

### 4. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App passwords
3. Generate a new app password for "Mail"
4. Copy the 16-character password to `EMAIL_PASS`

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:2025`

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── AuthController.js    # Authentication logic
│   │   └── qrController.js      # QR code generation
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── qrRoutes.js          # QR endpoints
│   ├── config/
│   │   └── email.js             # Email configuration
│   ├── lib/
│   │   └── DBconnect.js         # Database connection
│   └── index.js                 # Main server file
├── package.json
└── .env                         # Environment variables
```

## Key Features

### Authentication System
- User registration with email validation
- Secure login with JWT tokens
- Password reset with 6-digit email codes
- Automatic token expiry (65 seconds for testing)

### Email Service
- Nodemailer with Gmail SMTP
- HTML email templates
- Password reset code delivery

### Security
- Password hashing with bcrypt
- JWT token authentication
- CORS enabled
- Input validation

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Install new dependencies
npm install package-name

# Check for security vulnerabilities
npm audit
```

## Testing the API

### Using curl
```bash
# Register a user
curl -X POST http://localhost:2025/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:2025/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route
curl -X GET http://localhost:2025/qr/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the API collection
2. Set base URL to `http://localhost:2025`
3. Test each endpoint

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check your `MONGODB_URI` format
- Ensure IP is whitelisted in MongoDB Atlas
- Verify database user credentials

**Email Sending Failed**
- Confirm Gmail 2FA is enabled
- Verify app password is correct (16 characters, no spaces)
- Check Gmail account security settings

**JWT Token Issues**
- Ensure `JWT_SECRET` is set and secure
- Check token expiry time (currently 65 seconds)
- Verify token format in Authorization header

**Port Already in Use**
- Change `PORT` in `.env` file
- Kill existing process: `lsof -ti:2025 | xargs kill`

### Debug Mode

Enable detailed logging by adding to `.env`:
```env
NODE_ENV=development
DEBUG=*
```

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://prod-user:prod-pass@cluster.mongodb.net/taskorderking-prod
JWT_SECRET=super-secure-production-secret
EMAIL_USER=production-email@company.com
EMAIL_PASS=production-app-password
```

### Security Considerations
- Use strong, unique JWT secrets
- Enable HTTPS in production
- Implement rate limiting
- Add input sanitization
- Use environment-specific CORS settings
- Regular security audits with `npm audit`

### Deployment Platforms
- **Heroku**: Easy deployment with git integration
- **Railway**: Modern platform with automatic deployments
- **DigitalOcean**: Full control with App Platform
- **AWS**: EC2 or Elastic Beanstalk
- **Vercel**: Serverless functions

## Monitoring and Logging

Consider adding:
- Winston for structured logging
- Sentry for error tracking
- New Relic for performance monitoring
- Health check endpoints

## Next Steps

1. Add input validation middleware (Joi, express-validator)
2. Implement rate limiting (express-rate-limit)
3. Add API documentation (Swagger/OpenAPI)
4. Set up automated testing (Jest, Supertest)
5. Add database migrations
6. Implement refresh tokens
7. Add email templates for different scenarios
