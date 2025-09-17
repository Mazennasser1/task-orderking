# Dependencies Documentation

## Backend Dependencies

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.1.0 | Web framework for Node.js |
| `mongoose` | ^8.18.1 | MongoDB object modeling |
| `jsonwebtoken` | ^9.0.2 | JWT token generation and verification |
| `bcrypt` | ^6.0.0 | Password hashing |
| `nodemailer` | ^7.0.6 | Email sending |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^17.2.2 | Environment variable management |
| `uuid` | ^13.0.0 | UUID generation for QR codes |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.10 | Development server with auto-reload |

### Package.json
```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.18.1",
    "nodemailer": "^7.0.6",
    "uuid": "^13.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## Mobile Dependencies

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.7 | Expo SDK |
| `react` | 19.1.0 | React library |
| `react-native` | 0.81.4 | React Native framework |
| `expo-router` | ~6.0.4 | File-based routing |
| `zustand` | ^5.0.8 | State management |
| `@react-native-async-storage/async-storage` | ^2.2.0 | Persistent storage |

### UI & Navigation
| Package | Version | Purpose |
|---------|---------|---------|
| `@expo/vector-icons` | ^15.0.2 | Icon library |
| `react-native-safe-area-context` | ~5.6.0 | Safe area handling |
| `react-native-screens` | ~4.16.0 | Native screen optimization |
| `react-native-gesture-handler` | ~2.28.0 | Gesture handling |
| `react-native-reanimated` | ~4.1.0 | Animations |

### Expo Modules
| Package | Version | Purpose |
|---------|---------|---------|
| `expo-constants` | ~18.0.8 | App constants |
| `expo-font` | ~14.0.8 | Custom fonts |
| `expo-haptics` | ~15.0.7 | Haptic feedback |
| `expo-image` | ~3.0.8 | Optimized image component |
| `expo-linking` | ~8.0.8 | Deep linking |
| `expo-splash-screen` | ~31.0.10 | Splash screen |
| `expo-status-bar` | ~3.0.8 | Status bar control |
| `expo-symbols` | ~1.0.7 | SF Symbols |
| `expo-system-ui` | ~6.0.7 | System UI |
| `expo-web-browser` | ~15.0.7 | Web browser |

### Additional Features
| Package | Version | Purpose |
|---------|---------|---------|
| `react-native-qrcode-svg` | ^6.3.15 | QR code generation |
| `react-native-worklets` | 0.5.1 | Worklets support |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/react` | ~19.1.0 | TypeScript definitions |
| `eslint` | ^9.25.0 | Code linting |
| `eslint-config-expo` | ~10.0.0 | Expo ESLint config |
| `typescript` | ~5.9.2 | TypeScript support |

### Package.json
```json
{
  "name": "mobile",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "expo": "~54.0.7",
    "expo-constants": "~18.0.8",
    "expo-font": "~14.0.8",
    "expo-haptics": "~15.0.7",
    "expo-image": "~3.0.8",
    "expo-linking": "~8.0.8",
    "expo-router": "~6.0.4",
    "expo-splash-screen": "~31.0.10",
    "expo-status-bar": "~3.0.8",
    "expo-symbols": "~1.0.7",
    "expo-system-ui": "~6.0.7",
    "expo-web-browser": "~15.0.7",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.4",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-qrcode-svg": "^6.3.15",
    "react-native-reanimated": "~4.1.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  }
}
```

## Version Compatibility

### Node.js Version
- **Minimum**: Node.js 18.x
- **Recommended**: Node.js 20.x LTS
- **Tested**: Node.js 18.17.0, 20.10.0

### React Native Version
- **Current**: 0.81.4
- **Expo SDK**: 54.0.7
- **React**: 19.1.0

### Platform Support
- **iOS**: 13.4+
- **Android**: API level 21+ (Android 5.0)
- **Web**: Modern browsers with ES6+ support

## Security Considerations

### Backend Security
- `bcrypt` for password hashing (salt rounds: 10)
- `jsonwebtoken` for secure token generation
- `cors` configured for cross-origin requests
- `dotenv` for secure environment variable management

### Mobile Security
- `@react-native-async-storage/async-storage` for secure token storage
- JWT token auto-expiry and logout
- Input validation on all forms
- Secure API communication

## Performance Notes

### Bundle Size Optimization
- Expo SDK provides optimized builds
- Tree shaking enabled for unused code elimination
- Image optimization with `expo-image`
- Lazy loading for route-based code splitting

### Runtime Performance
- `react-native-reanimated` for smooth animations
- `react-native-screens` for native screen optimization
- `react-native-gesture-handler` for efficient gesture handling
- Zustand for lightweight state management

## Update Strategy

### Backend Updates
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Mobile Updates
```bash
# Check Expo SDK updates
npx expo install --fix

# Update specific package
npx expo install package-name@latest

# Update Expo CLI
npm install -g @expo/cli@latest
```

## Known Issues

### Backend
- `nodemailer` requires Gmail App Password for authentication
- `mongoose` connection pooling may need tuning for high traffic
- `bcrypt` is CPU intensive (consider async hashing for production)

### Mobile
- `react-native-reanimated` requires additional setup on Android
- `expo-router` has some limitations with complex navigation patterns
- `@react-native-async-storage/async-storage` has size limits

## Recommended Additions

### Backend
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `joi` - Input validation
- `winston` - Logging
- `jest` - Testing framework

### Mobile
- `@react-native-community/netinfo` - Network status
- `react-native-keychain` - Secure storage
- `react-native-biometrics` - Biometric authentication
- `@sentry/react-native` - Error tracking
