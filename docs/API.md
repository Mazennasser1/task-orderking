# API Documentation

## Base URL
```
http://localhost:2025
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "token": "jwt-token-string",
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "username": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `400` - Missing required fields, invalid email format, email already exists, password too short
- `500` - Server error

---

### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "message": "Successfully logged in",
  "user": {
    "id": "user-id",
    "username": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `400` - Missing credentials, invalid email format, user not found, invalid password
- `500` - Server error

---

### POST /auth/forgot-password
Send password reset code to user's email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "Password reset code has been sent to your email"
}
```

**Error Responses:**
- `400` - Email required, invalid email format
- `500` - Email sending failed

---

### POST /auth/reset-password
Reset password using email and 6-digit code.

**Request Body:**
```json
{
  "email": "string",
  "code": "string",
  "newPassword": "string"
}
```

**Response (200):**
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Responses:**
- `400` - Missing fields, invalid/expired code, password too short
- `500` - Server error

---

### POST /auth/verify-reset-token
Verify if a reset token is valid (legacy endpoint).

**Request Body:**
```json
{
  "token": "string",
  "userId": "string"
}
```

**Response (200):**
```json
{
  "message": "Reset token is valid",
  "valid": true
}
```

---

## QR Code Endpoints

### GET /qr/current
Get current UUID for QR code generation.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "uuid": "uuid-string"
}
```

**Error Responses:**
- `401` - No token provided
- `403` - Invalid/expired token

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Token Expiry
- JWT tokens expire after 65 seconds (for testing)
- Mobile app automatically logs out users when token expires
- Refresh tokens are not implemented in current version

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- Login attempts per IP
- Password reset requests per email
- General API rate limiting

## Security Notes

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens use HMAC SHA256
- Email verification codes expire after 1 hour
- CORS is enabled for all origins (configure for production)
- No input sanitization beyond basic validation

## Testing

Use tools like Postman, curl, or Thunder Client to test endpoints:

```bash
# Test registration
curl -X POST http://localhost:2025/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:2025/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:2025/qr/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
