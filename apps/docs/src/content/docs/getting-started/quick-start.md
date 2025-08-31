---
title: Quick Start
description: Get the Oakford platform running locally in minutes.
---

# Quick Start Guide

Get the entire Oakford platform up and running on your local machine in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **PostgreSQL** database (local or remote)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd oakford
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all applications and packages in the monorepo.

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the environment variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/oakford
NODE_ENV=development
LOG_LEVEL=info
PORT=9000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:9000
BACKEND_URL=http://localhost:9000

# Client-side Environment Variables
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

### 4. Database Setup

Build the database package and run migrations:

```bash
# Build the database package
pnpm --filter @repo/db build

# Run database migrations
pnpm --filter @repo/db db:push
```

### 5. Build Shared Packages

Build the shared packages that other applications depend on:

```bash
# Build environment configuration
pnpm --filter @repo/env build

# Build UI components (if applicable)
pnpm --filter @repo/ui build
```

## Running the Platform

### Start All Applications

```bash
pnpm dev
```

This command starts all applications simultaneously:

- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:9000
- **Documentation**: http://localhost:4321

### Start Individual Applications

You can also start applications individually:

```bash
# Backend API
pnpm --filter backend dev

# Web Application
pnpm --filter web dev

# Admin Panel
pnpm --filter admin dev

# Mobile App
pnpm --filter mobile dev

# Documentation
pnpm --filter docs dev
```

## Verify Installation

### 1. Test Backend API

Visit http://localhost:9000 - you should see "Hello Hono!"

### 2. Test Web Application

1. Visit http://localhost:3000
2. Navigate to the login page
3. Try creating an account or signing in

### 3. Test Admin Panel

1. Visit http://localhost:5173
2. You should be redirected to the login page
3. Use admin credentials to access the dashboard

### 4. Test Mobile App

```bash
# Start the mobile app
pnpm --filter mobile dev

# Follow the Expo CLI instructions to open on device/simulator
```

## Common Issues

### Port Conflicts

If you encounter port conflicts, you can modify the ports in the respective configuration files:

- **Backend**: Change `PORT` in `.env`
- **Web App**: Modify `next.config.js` or use `PORT=3001 pnpm dev`
- **Admin Panel**: Update `vite.config.ts`

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Verify the `DATABASE_URL` in your `.env` file
3. Check database permissions and credentials

### Build Errors

If you encounter build errors:

1. Clear node_modules: `rm -rf node_modules && pnpm install`
2. Clear build caches: `pnpm clean` (if available)
3. Rebuild packages: `pnpm build`

## Development Workflow

### Making Changes

1. **Shared Packages**: Changes to `packages/*` require rebuilding
2. **Applications**: Most changes hot-reload automatically
3. **Environment**: Restart applications after changing `.env`

### Adding Dependencies

```bash
# Add to specific app
pnpm --filter web add package-name

# Add to workspace root
pnpm add -w package-name

# Add shared package dependency
pnpm --filter @repo/ui add package-name
```

## Next Steps

- [Architecture Overview](/getting-started/architecture/) - Understand the system design
- [Development Setup](/internal/development-setup/) - Detailed development environment
- [Environment Configuration](/internal/environment/) - Advanced environment setup
- [Authentication System](/internal/authentication/) - Learn about the auth implementation