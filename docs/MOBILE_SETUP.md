# Mobile Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio (for Android development)
- Expo Go app on your physical device (optional)

## Installation

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Backend URL

Update the API base URL in `store/authStore.js`:

```javascript
// Change this to your backend URL
const API_BASE_URL = 'http://192.168.1.6:2025'; // Local development
// const API_BASE_URL = 'https://your-backend.herokuapp.com'; // Production
```

### 3. Start Development Server

```bash
npx expo start
```

This will open the Expo Dev Tools in your browser and show a QR code.

## Running the App

### Option 1: Physical Device (Recommended)
1. Install Expo Go from App Store/Play Store
2. Scan the QR code with Expo Go
3. The app will load on your device

### Option 2: iOS Simulator (Mac only)
1. Press `i` in the terminal or click "Run on iOS simulator"
2. Requires Xcode installed

### Option 3: Android Emulator
1. Press `a` in the terminal or click "Run on Android device/emulator"
2. Requires Android Studio and emulator setup

## Project Structure

```
mobile/
├── app/                          # Expo Router pages
│   ├── _layout.jsx              # Root layout with auth guard
│   ├── index.jsx                # Main app screen
│   └── (auth)/                  # Auth group
│       ├── _layout.jsx          # Auth layout
│       ├── login.jsx             # Login screen
│       ├── signup.jsx            # Registration screen
│       ├── forgetPass.jsx        # Forgot password screen
│       └── resetPass.jsx         # Reset password screen
├── components/
│   └── SafeScreen.jsx           # Safe area wrapper
├── constants/
│   └── colors.js                # App color scheme
├── store/
│   └── authStore.js             # Zustand auth state
├── utils/                       # Utility functions
├── assets/                      # Images, fonts, etc.
├── package.json
└── app.json                     # Expo configuration
```

## Key Features

### Authentication Flow
- **Registration**: Username, email, password validation
- **Login**: Email/password with JWT token storage
- **Password Reset**: Email-based 6-digit code system
- **Auto-logout**: Automatic logout on token expiry

### State Management
- Zustand for global state
- AsyncStorage for persistent token storage
- Automatic auth state synchronization

### Navigation
- Expo Router for file-based routing
- Protected routes with auth guards
- Automatic redirects based on auth state

### UI Components
- Modern, clean design
- Consistent color scheme
- Responsive layouts
- Loading states and error handling

## Development Commands

```bash
# Start development server
npx expo start

# Start with specific platform
npx expo start --ios
npx expo start --android

# Clear cache and restart
npx expo start --clear

# Run linting
npm run lint

# Build for production
npx expo build:android
npx expo build:ios
```

## Configuration

### App Configuration (app.json)
```json
{
  "expo": {
    "name": "Task OrderKing",
    "slug": "task-orderking",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    }
  }
}
```

### Environment Variables
For different environments, create:
- `.env.development`
- `.env.staging`
- `.env.production`

```env
# .env.development
EXPO_PUBLIC_API_URL=http://192.168.1.6:2025
EXPO_PUBLIC_ENV=development

# .env.production
EXPO_PUBLIC_API_URL=https://your-backend.herokuapp.com
EXPO_PUBLIC_ENV=production
```

## Testing

### Manual Testing Checklist
- [ ] User registration with valid/invalid data
- [ ] Login with correct/incorrect credentials
- [ ] Password reset flow (email → code → new password)
- [ ] Auto-logout on token expiry
- [ ] Navigation between screens
- [ ] Error handling and user feedback
- [ ] Loading states during API calls

### Device Testing
- Test on both iOS and Android
- Test on different screen sizes
- Test with slow network connections
- Test offline scenarios

## Troubleshooting

### Common Issues

**Metro bundler errors**
```bash
npx expo start --clear
```

**Dependencies issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**iOS Simulator not working**
- Ensure Xcode is installed
- Reset simulator: Device → Erase All Content and Settings

**Android Emulator issues**
- Check Android Studio installation
- Verify emulator is running
- Check ADB connection: `adb devices`

**Network requests failing**
- Check backend server is running
- Verify API URL in authStore.js
- Check device/emulator can reach backend IP
- For Android emulator, use `10.0.2.2` instead of `localhost`

**Expo Go connection issues**
- Ensure device and computer are on same network
- Try switching between LAN and Tunnel in Expo Dev Tools
- Restart Expo CLI and Expo Go app

### Debug Mode

Enable debug logging:
```javascript
// In authStore.js
console.log('API Response:', data);
console.log('Token:', token);
```

## Building for Production

### 1. Configure EAS Build
```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

### 2. Build for Android
```bash
eas build --platform android
```

### 3. Build for iOS
```bash
eas build --platform ios
```

### 4. Submit to Stores
```bash
eas submit --platform android
eas submit --platform ios
```

## Performance Optimization

### Bundle Size
- Use dynamic imports for large components
- Optimize images (WebP format)
- Remove unused dependencies

### Runtime Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize list rendering with FlatList
- Use native driver for animations

### Network Optimization
- Implement request caching
- Add retry logic for failed requests
- Use optimistic updates where appropriate

## Security Considerations

- Store sensitive data in secure storage
- Validate all user inputs
- Implement proper error handling
- Use HTTPS in production
- Regular dependency updates

## Next Steps

1. Add push notifications
2. Implement offline support
3. Add biometric authentication
4. Implement deep linking
5. Add analytics tracking
6. Set up automated testing
7. Add accessibility features
8. Implement dark mode toggle
