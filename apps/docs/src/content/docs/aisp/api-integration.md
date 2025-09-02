---
title: API Integration
description: Technical guide for integrating with AISP APIs and services
---

# API Integration

## Overview

Our AISP API provides secure, PSD2-compliant access to account information services. This guide covers integration patterns, authentication flows, and best practices.

## Getting Started

### Prerequisites
- Valid AISP license
- Client credentials from Oakford Technology
- SSL certificate for production environments
- Understanding of OAuth 2.0 and OpenID Connect

### Base URLs
- **Sandbox**: `https://api-sandbox.oakford.dev/aisp/v1`
- **Production**: `https://api.oakford.dev/aisp/v1`

## Authentication

### OAuth 2.0 Flow
1. **Authorization Request**: Redirect user to authorization server
2. **User Consent**: Customer authorizes account access
3. **Authorization Code**: Receive code via redirect
4. **Access Token**: Exchange code for access token
5. **API Access**: Use token for authenticated requests

```javascript
// Example token exchange
const response = await fetch('/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${btoa(clientId + ':' + clientSecret)}`
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: redirectUri
  })
});
```

## Core Endpoints

### Account Information
- `GET /accounts` - List accessible accounts
- `GET /accounts/{id}` - Get account details
- `GET /accounts/{id}/balances` - Get account balances
- `GET /accounts/{id}/transactions` - Get transaction history

### Example Request
```javascript
const accounts = await fetch('/api/v1/accounts', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  }
});
```

## Error Handling

Standard HTTP status codes with detailed error responses:

```json
{
  "error": "invalid_request",
  "error_description": "Missing required parameter: account_id",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limits

- **Sandbox**: 100 requests/minute
- **Production**: 1000 requests/minute
- **Burst**: Up to 50 requests in 10 seconds

## SDKs and Libraries

- [Node.js SDK](https://github.com/oakford-tech/aisp-node)
- [Python SDK](https://github.com/oakford-tech/aisp-python)
- [PHP SDK](https://github.com/oakford-tech/aisp-php)

## Support

For technical support, contact our [API support team](mailto:api-support@oakford.dev).