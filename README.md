# Oakford Monorepo

A full-stack TypeScript monorepo built with modern tools and best practices.

## 🏗️ Architecture

This monorepo contains multiple applications and shared packages:

### Applications
- **`apps/web`** - Next.js 15 customer-facing web application
- **`apps/admin`** - React Router 7 admin panel with shadcn/ui
- **`apps/backend`** - Hono.js API server with Better Auth
- **`apps/mobile`** - Expo React Native mobile application
- **`apps/docs`** - Starlight documentation website

### Packages
- **`packages/env`** - Centralized environment configuration with Zod validation
- **`packages/db`** - Drizzle ORM database layer with PostgreSQL
- **`packages/ui`** - Shared React components (planned)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd oakford

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# Build shared packages
pnpm build:packages

# Start all development servers
pnpm dev
```

### Development Servers
- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:5173  
- **Backend API**: http://localhost:9000
- **Documentation**: http://localhost:4321

## 🛠️ Development

### Package Scripts

```bash
# Development
pnpm dev              # Start all apps in development
pnpm dev:web          # Start only web app
pnpm dev:admin        # Start only admin panel
pnpm dev:backend      # Start only backend
pnpm dev:docs         # Start only docs

# Building
pnpm build            # Build all apps and packages
pnpm build:packages   # Build only shared packages
pnpm build:web        # Build only web app
pnpm build:admin      # Build only admin panel

# Testing
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
```

### Environment Configuration

The monorepo uses a centralized environment configuration system:

- **Server-side**: Import from `@repo/env` 
- **Client-side**: Import from `@repo/env/client`

Environment variables are validated using Zod schemas and automatically detect the workspace root.

### Database

The database layer uses Drizzle ORM with PostgreSQL:

```bash
# Generate migrations
cd packages/db
pnpm db:generate

# Run migrations  
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

### Authentication

Authentication is handled by Better Auth with the following features:

- Email/password authentication
- Session management
- CORS configuration for cross-origin requests
- Separate admin authentication flow

## 📁 Project Structure

```
oakford/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/app/         # App router pages
│   │   ├── src/lib/         # Utilities and configurations
│   │   └── src/components/  # React components
│   ├── admin/               # React Router admin panel
│   │   ├── app/routes/      # Route components
│   │   ├── app/components/  # UI components (shadcn/ui)
│   │   └── app/lib/         # Utilities
│   ├── backend/             # Hono.js API server
│   │   ├── src/lib/         # Auth and utilities
│   │   └── src/index.ts     # Server entry point
│   ├── mobile/              # Expo React Native app
│   └── docs/                # Starlight documentation
├── packages/
│   ├── env/                 # Environment configuration
│   │   ├── src/index.ts     # Server-side env
│   │   └── src/client.ts    # Client-side env
│   └── db/                  # Database layer
│       ├── src/schema/      # Drizzle schemas
│       └── drizzle.config.ts
├── .env                     # Environment variables
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json             # Root package.json
```

## 🔧 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React Router 7** - Client-side routing for admin panel
- **Expo** - React Native framework for mobile
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable UI components

### Backend
- **Hono.js** - Fast web framework for the edge
- **Better Auth** - Authentication library
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Primary database

### Development
- **TypeScript** - Type safety across all packages
- **pnpm** - Fast, disk space efficient package manager
- **Vite** - Fast build tool for admin panel
- **Turbopack** - Fast bundler for Next.js

## 🔐 Authentication Flow

### Web Application (`apps/web`)
1. User visits authentication pages (`/login`, `/register`, etc.)
2. Forms submit to Better Auth API endpoints
3. Successful authentication redirects to dashboard
4. Client-side auth state managed via Better Auth React client

### Admin Panel (`apps/admin`)
1. Admin visits `/login` route
2. Form submission makes direct API call to Better Auth
3. Successful authentication redirects to `/dashboard`
4. Auth state managed via custom `useAuth` hook

### API Endpoints
- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - User registration  
- `POST /api/auth/forget-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `GET /api/auth/session` - Get current session

## 🚀 Deployment

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_AUTH_TOKEN=optional_auth_token

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:9000
BACKEND_URL=http://localhost:9000

# Client-side (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000

# Application
NODE_ENV=development
PORT=9000
LOG_LEVEL=info
```

### Build Process

```bash
# Build all packages and applications
pnpm build

# Individual builds
pnpm build:packages  # Build shared packages first
pnpm build:web       # Build Next.js app
pnpm build:admin     # Build admin panel
pnpm build:docs      # Build documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.