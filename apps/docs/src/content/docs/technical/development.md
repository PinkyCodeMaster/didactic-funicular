---
title: Development Guide
description: Technical guide for developers working on the Oakford platform
---

# Development Guide

This guide covers the technical aspects of developing and maintaining the Oakford platform.

## Development Environment Setup

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **Git**: Latest version

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oakford
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Generate and run migrations
   cd packages/db
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Build shared packages**
   ```bash
   pnpm build:packages
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

## Project Architecture

### Monorepo Structure

The project uses a monorepo architecture with the following structure:

```
oakford/
├── apps/                    # Applications
│   ├── web/                # Next.js web app
│   ├── admin/              # React Router admin panel
│   ├── backend/            # Hono.js API server
│   ├── mobile/             # Expo React Native app
│   └── docs/               # Starlight documentation
├── packages/               # Shared packages
│   ├── env/                # Environment configuration
│   ├── db/                 # Database layer
│   └── ui/                 # Shared UI components (planned)
└── tools/                  # Development tools (planned)
```

### Technology Stack

#### Frontend
- **Next.js 15**: Web application framework
- **React Router 7**: Admin panel routing
- **Expo**: Mobile app framework
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI component library

#### Backend
- **Hono.js**: Web framework
- **Better Auth**: Authentication
- **Drizzle ORM**: Database ORM
- **PostgreSQL**: Database

#### Development Tools
- **TypeScript**: Type safety
- **pnpm**: Package management
- **Vite**: Build tool (admin panel)
- **Turbopack**: Build tool (Next.js)

## Package Development

### Environment Package (`packages/env`)

Centralized environment configuration with Zod validation:

```typescript
// Server-side usage
import env from '@repo/env';
console.log(env.DATABASE_URL);

// Client-side usage
import env from '@repo/env/client';
console.log(env.NEXT_PUBLIC_BACKEND_URL);
```

**Key Features:**
- Workspace root detection
- Zod schema validation
- Server/client separation
- Type safety

### Database Package (`packages/db`)

Drizzle ORM configuration and schemas:

```typescript
// Usage in applications
import { db } from '@repo/db';
import { users } from '@repo/db/schema';

const allUsers = await db.select().from(users);
```

**Key Features:**
- PostgreSQL integration
- Type-safe queries
- Migration management
- Schema definitions

## Application Development

### Web App (`apps/web`)

Next.js 15 application with App Router:

**Key Features:**
- Server-side rendering
- Authentication pages
- Responsive design
- Better Auth integration

**Development:**
```bash
cd apps/web
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm lint       # Run linting
```

### Admin Panel (`apps/admin`)

React Router 7 application with shadcn/ui:

**Key Features:**
- Client-side routing
- Admin authentication
- Dashboard interface
- Component library

**Development:**
```bash
cd apps/admin
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm typecheck  # Type checking
```

### Backend API (`apps/backend`)

Hono.js server with Better Auth:

**Key Features:**
- RESTful API
- Authentication endpoints
- CORS configuration
- Database integration

**Development:**
```bash
cd apps/backend
pnpm dev        # Start development server
pnpm build      # Build for production
```

### Mobile App (`apps/mobile`)

Expo React Native application:

**Key Features:**
- Cross-platform (iOS/Android)
- Native navigation
- Push notifications
- Offline support

**Development:**
```bash
cd apps/mobile
pnpm start      # Start Expo dev server
pnpm ios        # Run on iOS simulator
pnpm android    # Run on Android emulator
```

## Authentication System

### Better Auth Configuration

The authentication system uses Better Auth with the following configuration:

```typescript
// apps/backend/src/lib/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:3000"],
});
```

### Client Integration

**Web App (Next.js):**
```typescript
// apps/web/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import env from "@repo/env/client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL
});
```

**Admin Panel (React Router):**
```typescript
// Direct API calls for server-side actions
const response = await fetch("/api/auth/sign-in/email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

## Database Management

### Schema Definition

Define database schemas in `packages/db/src/schema/`:

```typescript
// packages/db/src/schema/users.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Migrations

Generate and run migrations:

```bash
cd packages/db

# Generate migration from schema changes
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## Testing

### Unit Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test:web
pnpm test:admin
pnpm test:backend
```

### Integration Testing

```bash
# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

### Test Database

Use a separate test database:

```bash
# Set up test database
DATABASE_URL=postgresql://user:pass@localhost:5432/oakford_test pnpm db:migrate
```

## Deployment

### Build Process

```bash
# Build all packages and applications
pnpm build

# Build specific applications
pnpm build:web
pnpm build:admin
pnpm build:backend
```

### Environment Variables

Required for production:

```bash
# Database
DATABASE_URL=postgresql://...
DATABASE_AUTH_TOKEN=...

# Authentication
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://api.yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Client-side
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# Application
NODE_ENV=production
PORT=9000
LOG_LEVEL=info
```

### Docker Deployment

Each application includes a Dockerfile:

```bash
# Build Docker images
docker build -t oakford-web apps/web
docker build -t oakford-admin apps/admin
docker build -t oakford-backend apps/backend
```

## Code Style and Standards

### TypeScript Configuration

- Strict mode enabled
- Path mapping for imports
- Consistent tsconfig across packages

### Linting and Formatting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck
```

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Run tests and linting
4. Create pull request
5. Code review and merge

### Commit Convention

Use conventional commits:

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
refactor: improve error handling
test: add unit tests for auth
```

## Performance Optimization

### Frontend Optimization

- Code splitting with dynamic imports
- Image optimization with Next.js
- Bundle analysis and optimization
- Caching strategies

### Backend Optimization

- Database query optimization
- Connection pooling
- Response caching
- Rate limiting

### Monitoring

- Application performance monitoring
- Error tracking
- Database performance
- User analytics

## Security Considerations

### Authentication Security

- Secure session management
- Password hashing
- CSRF protection
- Rate limiting

### API Security

- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

### Data Protection

- Encryption at rest
- Secure data transmission
- Privacy compliance
- Access controls

## Troubleshooting

### Common Issues

**Build failures:**
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify environment variables

**Database connection issues:**
- Check DATABASE_URL format
- Verify database is running
- Check network connectivity

**Authentication problems:**
- Verify BETTER_AUTH_SECRET
- Check CORS configuration
- Validate API endpoints

### Debug Mode

Enable debug logging:

```bash
DEBUG=* pnpm dev
LOG_LEVEL=debug pnpm dev
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

### Code Review Process

- All changes require review
- Automated tests must pass
- Documentation updates required
- Performance impact considered

## Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Router Documentation](https://reactrouter.com)
- [Hono.js Documentation](https://hono.dev)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

### Community

- GitHub Discussions
- Discord Server
- Stack Overflow
- Developer Blog