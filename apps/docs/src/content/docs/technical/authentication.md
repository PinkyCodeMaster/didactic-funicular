---
title: Authentication System
description: Complete guide to the Better Auth authentication system implementation
---

# Authentication System

The Oakford platform uses [Better Auth](https://better-auth.com) for modern, secure authentication across all applications.

## Overview

The authentication system provides:

- **Email/Password Authentication**: Traditional login with secure password handling
- **Email Verification**: Automatic email verification on signup
- **Password Reset**: Secure password reset via email
- **Session Management**: HTTP-only cookies for secure sessions
- **Multi-App Support**: Shared authentication across web, admin, and mobile apps
- **Email Integration**: Resend integration for transactional emails

## Architecture

```mermaid
graph TB
    subgraph "Client Applications"
        WEB[Web App<br/>Next.js]
        ADMIN[Admin Panel<br/>React Router]
        MOBILE[Mobile App<br/>Expo]
    end
    
    subgraph "Backend Services"
        API[Backend API<br/>Hono.js<br/>:9000]
        AUTH[Better Auth<br/>Middleware]
        EMAIL[Email Service<br/>Resend]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Database)]
        TABLES[Auth Tables<br/>users, sessions, accounts, verification]
    end
    
    WEB --> API
    ADMIN --> API
    MOBILE --> API
    
    API --> AUTH
    AUTH --> DB
    AUTH --> EMAIL
    
    DB --> TABLES
```

## Backend Configuration

### Better Auth Setup

The authentication is configured in `apps/backend/src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "packages-db";
import env from "@repo/env";
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendChangeEmailVerification 
} from '@/lib/resend';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true to require verification
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        verificationUrl: url,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendChangeEmailVerification({
          to: user.email,
          newEmail,
          verificationUrl: url,
        });
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [nextCookies()],
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "mobile://",
  ],
});
```

### API Routes

Authentication endpoints are handled in `apps/backend/src/index.ts`:

```typescript
// Better Auth handler - handles all auth routes
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  console.log(`Auth request: ${c.req.method} ${c.req.url}`)
  return auth.handler(c.req.raw)
})
```

This creates the following endpoints:
- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email` - Verify email address

## Database Schema

The authentication system uses four main tables defined in `packages/db/src/schema/auth.ts`:

### Users Table
```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
```

### Sessions Table
```typescript
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
```

### Accounts Table
```typescript
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  password: text("password"), // Hashed password for email/password auth
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
```

### Verification Table
```typescript
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
```

## Email Integration

### Email Service Configuration

The email service is configured in `apps/backend/src/lib/resend/index.ts`:

```typescript
import { Resend } from 'resend';
import { render } from '@react-email/render';
import env from '@repo/env';

const resend = new Resend(env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV === 'development';

async function sendEmail({ to, subject, html }) {
  if (isDevelopment) {
    // Log emails to console in development
    console.log('\n=== EMAIL (Development Mode) ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML Content:\n${html}`);
    console.log('=== END EMAIL ===\n');
    return { success: true, messageId: 'dev-mode' };
  }

  // Send real emails in production
  const { data, error } = await resend.emails.send({
    from: 'noreply@wolfpackdefence.co.uk',
    to,
    subject,
    html,
  });

  return error ? { success: false, error } : { success: true, data };
}
```

### Email Templates

Email templates are React components in `apps/backend/src/emails/`:

**Verification Email** (`verification-email.tsx`):
```tsx
/** @jsxImportSource react */
import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

export const EmailVerificationTemplate = ({ userEmail, verificationUrl }) => (
  <Html>
    <Head />
    <Body>
      <Container>
        <Heading>Verify your email address</Heading>
        <Text>
          Hi there! Please verify your email address ({userEmail}) by clicking the button below.
        </Text>
        <Button href={verificationUrl}>
          Verify Email Address
        </Button>
      </Container>
    </Body>
  </Html>
);
```

## Frontend Integration

### Web App (Next.js)

The web app uses the Better Auth React client in `apps/web/src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react"
import env from "@repo/env/client"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL
})
```

**Login Component Example**:
```tsx
'use client';

import { useState, Suspense } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (!error) {
      router.push(redirectTo);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
```

### Route Protection Middleware

The web app includes middleware for route protection in `apps/web/src/middleware.ts`:

```typescript
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authRoutes = ['/sign-in', '/login', '/register'];
  const protectedRoutes = ['/account', '/dashboard'];

  // Get session from backend
  let session = null;
  try {
    const response = await betterFetch("/api/auth/get-session", {
      baseURL: "http://localhost:9000",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    session = response.data;
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  // Redirect logic based on authentication state
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
```

## Environment Configuration

Required environment variables:

```bash
# Backend Authentication
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:9000
BACKEND_URL=http://localhost:9000

# Email Service
RESEND_API_KEY=re_your_resend_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/oakford

# Client-side (Next.js)
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

## Usage Examples

### User Registration

```typescript
const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe"
});

if (error) {
  console.error("Registration failed:", error.message);
} else {
  console.log("User registered:", data.user);
}
```

### User Login

```typescript
const { data, error } = await authClient.signIn.email({
  email: "user@example.com",
  password: "securepassword"
});

if (error) {
  console.error("Login failed:", error.message);
} else {
  console.log("User logged in:", data.user);
}
```

### Get Current Session

```typescript
const { data: session } = await authClient.getSession();

if (session) {
  console.log("Current user:", session.user);
} else {
  console.log("No active session");
}
```

### Password Reset

```typescript
// Request password reset
const { error } = await authClient.forgetPassword({
  email: "user@example.com",
  redirectTo: "http://localhost:3000/reset-password"
});

// Reset password with token
const { error } = await authClient.resetPassword({
  newPassword: "newpassword",
  token: "reset-token-from-email"
});
```

## Security Features

### Session Security
- **HTTP-only cookies**: Prevents XSS attacks
- **Secure flag**: HTTPS-only in production
- **SameSite**: CSRF protection
- **Session expiration**: Automatic cleanup

### Password Security
- **Bcrypt hashing**: Industry-standard password hashing
- **Salt rounds**: Configurable complexity
- **Password validation**: Minimum requirements

### Email Security
- **Token expiration**: Time-limited verification tokens
- **Single-use tokens**: Tokens invalidated after use
- **Rate limiting**: Prevents spam and abuse

## Development vs Production

### Development Mode
- Emails logged to console instead of sent
- Relaxed CORS settings
- Debug logging enabled
- HTTP cookies allowed

### Production Mode
- Real emails sent via Resend
- Strict CORS configuration
- HTTPS-only cookies
- Error logging only

## Troubleshooting

### Common Issues

**Authentication not working:**
1. Check `BETTER_AUTH_SECRET` is set
2. Verify `BETTER_AUTH_URL` matches your backend
3. Ensure database tables exist (`pnpm --filter packages-db db:push`)

**Emails not sending:**
1. Verify `RESEND_API_KEY` is correct
2. Check email templates compile without errors
3. Ensure sender domain is verified in Resend

**CORS errors:**
1. Add your frontend URL to `trustedOrigins`
2. Check CORS middleware configuration
3. Verify credentials are included in requests

**Session issues:**
1. Clear browser cookies
2. Check cookie domain settings
3. Verify session table in database

### Debug Mode

Enable debug logging:

```bash
DEBUG=better-auth:* pnpm dev
```

## Testing

### Unit Tests

Test authentication functions:

```typescript
import { auth } from '@/lib/auth';

describe('Authentication', () => {
  it('should create user session', async () => {
    const session = await auth.api.signInEmail({
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    expect(session.user).toBeDefined();
    expect(session.session).toBeDefined();
  });
});
```

### Integration Tests

Test full authentication flow:

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up and sign in', async ({ page }) => {
  // Sign up
  await page.goto('/register');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Should redirect to account page
  await expect(page).toHaveURL('/account');
});
```

## Migration Guide

### From Other Auth Systems

1. **Export user data** from existing system
2. **Map user fields** to Better Auth schema
3. **Hash passwords** using bcrypt
4. **Import data** into PostgreSQL
5. **Update client code** to use Better Auth client
6. **Test authentication flow** thoroughly

### Schema Updates

When updating the auth schema:

1. **Generate migration**: `pnpm --filter packages-db db:generate`
2. **Review changes**: Check generated SQL
3. **Backup database**: Before applying changes
4. **Apply migration**: `pnpm --filter packages-db db:push`
5. **Test functionality**: Verify auth still works

## Best Practices

### Security
- Use strong secrets (32+ characters)
- Enable HTTPS in production
- Implement rate limiting
- Regular security audits
- Keep dependencies updated

### Performance
- Use connection pooling
- Cache session data
- Optimize database queries
- Monitor response times
- Scale horizontally

### User Experience
- Clear error messages
- Loading states
- Progressive enhancement
- Mobile-friendly forms
- Accessibility compliance

### Development
- Environment separation
- Automated testing
- Code reviews
- Documentation updates
- Version control