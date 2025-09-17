# Task OrderKing

A full-stack task management application with React Native mobile frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Expo CLI (`npm install -g @expo/cli`)
- Gmail account with App Password (for email features)

### 1. Clone Repository
```bash
git clone <repository-url>
cd task-orderking
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Gmail credentials
npm run dev
```

### 3. Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

## 📱 Features

- **User Authentication**: Register, login, password reset with email verification
- **JWT Security**: Automatic token expiry and logout
- **Password Reset**: 6-digit code via email
- **QR Code Generation**: Dynamic UUID-based QR codes
- **Modern UI**: Clean, responsive design with dark/light themes

## 🏗️ Architecture

```
task-orderking/
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API endpoints
│   │   ├── config/      # Email configuration
│   │   └── lib/         # Database connection
│   └── package.json
├── mobile/           # React Native app
│   ├── app/          # Expo Router pages
│   ├── components/   # Reusable components
│   ├── store/        # Zustand state management
│   └── constants/    # App constants
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=2025
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskorderking
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Backend Setup Guide](./docs/BACKEND_SETUP.md)
- [Mobile Setup Guide](./docs/MOBILE_SETUP.md)
- [Dependencies](./docs/DEPENDENCIES.md)

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Mobile Development
```bash
cd mobile
npx expo start  # Opens Expo Dev Tools
```

### Testing API Endpoints
```bash
# Register user
curl -X POST http://localhost:2025/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:2025/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to Heroku/Railway/DigitalOcean
4. Update mobile app API base URL

### Mobile Deployment
1. Build for production: `expo build:android` or `expo build:ios`
2. Submit to app stores via Expo Application Services (EAS)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@taskorderking.com or create an issue in the repository.

---

**Built with ❤️ using React Native, Node.js, and MongoDB**
