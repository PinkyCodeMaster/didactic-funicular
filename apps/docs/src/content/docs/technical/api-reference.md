---
title: API Reference
description: Complete API documentation for the Oakford platform
sidebar:
  badge: 
    text: 'v1.0'
    variant: 'success'
---

import { Card, CardGrid, LinkCard, Badge, Tabs, TabItem, Code } from '@astrojs/starlight/components';

# API Reference

The Oakford platform provides a comprehensive REST API built with Hono.js and Better Auth.

<Card title="API Information" icon="information">
  **Base URL**: `http://localhost:9000/api`  
  **Version**: 1.0  
  **Authentication**: Session-based with Better Auth  
  **Rate Limiting**: Yes (see details below)
</Card>

## Base URL

```
http://localhost:9000/api
```

## Authentication

All API requests require authentication using session cookies or bearer tokens.

### Authentication Endpoints

#### Sign In

```http
POST /auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session_456",
    "expiresAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Sign Up

```http
POST /auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Password Reset

```http
POST /auth/forget-password
Content-Type: application/json

{
  "email": "user@example.com",
  "redirectTo": "/reset-password"
}
```

#### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_123",
  "newPassword": "newpassword123"
}
```

#### Email Verification

```http
GET /auth/verify-email?token=verification_token_123
```

#### Get Session

```http
GET /auth/session
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session_456",
    "expiresAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Sign Out

```http
POST /auth/sign-out
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **Admin endpoints**: 1000 requests per minute per admin

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:

- `http://localhost:3000` (Web app)
- `http://localhost:5173` (Admin panel)

## Request/Response Format

### Content Types

- **Request**: `application/json`
- **Response**: `application/json`

### Date Format

All dates are returned in ISO 8601 format:

```json
{
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:30:00.000Z"
}
```

### Pagination

List endpoints support pagination:

```http
GET /api/users?page=1&limit=20&sort=createdAt&order=desc
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## SDK and Client Libraries

### JavaScript/TypeScript

```bash
npm install @oakford/api-client
```

```typescript
import { OakfordClient } from '@oakford/api-client';

const client = new OakfordClient({
  baseURL: 'http://localhost:9000/api',
  apiKey: 'your-api-key'
});

// Sign in
const { user } = await client.auth.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

### React Hook

```typescript
import { useAuth } from '@oakford/react-hooks';

function MyComponent() {
  const { user, signIn, signOut, isLoading } = useAuth();
  
  // Component logic
}
```

## Webhooks

The platform supports webhooks for real-time notifications:

### Webhook Events

- `user.created` - New user registration
- `user.updated` - User profile changes
- `user.deleted` - User account deletion
- `auth.login` - User login
- `auth.logout` - User logout

### Webhook Payload

```json
{
  "event": "user.created",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Webhook Security

Webhooks are signed using HMAC-SHA256. Verify the signature using the `X-Webhook-Signature` header:

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return signature === `sha256=${expectedSignature}`;
}
```

## Testing

### Test Environment

Use the test environment for development:

```
Base URL: http://localhost:9000/api
Test API Key: test_key_123
```

### Postman Collection

Download the Postman collection for easy API testing:

[Download Postman Collection](./oakford-api.postman_collection.json)

## Support

For API support:

- **Documentation**: This reference guide
- **Issues**: GitHub repository
- **Email**: api-support@oakford.com
- **Discord**: #api-support channel