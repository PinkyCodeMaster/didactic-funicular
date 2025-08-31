# 🚀 Oakford - Modern Full-Stack Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A production-ready, full-stack TypeScript monorepo featuring modern web, mobile, and admin applications with comprehensive authentication, database integration, and developer tooling.

## ✨ Features

🔐 **Complete Authentication System**
- Email/password authentication with Better Auth
- Session management and CORS support
- Password reset and email verification
- Separate admin authentication flow

📱 **Multi-Platform Applications**
- Modern web app with Next.js 15 and App Router
- Native mobile app with Expo and React Native
- Admin dashboard with React Router 7 and shadcn/ui
- Comprehensive documentation with Starlight

🗄️ **Robust Database Layer**
- PostgreSQL with Drizzle ORM
- Type-safe database operations
- Migration system and schema management
- Database studio for development

🛠️ **Developer Experience**
- Full TypeScript support across all packages
- Centralized environment configuration
- Hot reload and fast builds with Turbo
- Comprehensive testing and linting setup

## 🏗️ Architecture

This monorepo contains multiple applications and shared packages:

### 🎯 Applications
- **`apps/web`** - Next.js 15 customer-facing web application with authentication
- **`apps/admin`** - React Router 7 admin panel with beautiful shadcn/ui components
- **`apps/backend`** - High-performance Hono.js API server with Better Auth integration
- **`apps/mobile`** - Cross-platform Expo React Native mobile application
- **`apps/docs`** - Beautiful Starlight documentation website with technical guides

### 📦 Shared Packages
- **`packages/env`** - Centralized environment configuration with Zod validation
- **`packages/db`** - Drizzle ORM database layer with PostgreSQL schemas
- **`packages/ui`** - Shared React components library (planned)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL** database (local or cloud)
- **Git** for version control

### ⚡ One-Command Setup

```bash
# Clone and setup everything
git clone https://github.com/PinkyCodeMaster/didactic-funicular.git
cd didactic-funicular && pnpm install
```

### 🔧 Environment Configuration

Create your environment file:

```bash
cp .env.example .env
```

Update with your configuration:

```env
# 🗄️ Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/oakford

# 🔐 Authentication Secrets
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:9000
BACKEND_URL=http://localhost:9000

# 🌐 Client Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000

# 📧 Email Configuration (Optional)
RESEND_API_KEY=your-resend-api-key
```

### 🏃‍♂️ Start Development

```bash
# Setup database
pnpm db:push

# Start all applications
pnpm dev
```

### 🌐 Access Your Applications
- **🖥️ Web App**: http://localhost:3000
- **⚡ Admin Panel**: http://localhost:5173  
- **🔌 Backend API**: http://localhost:9000
- **📚 Documentation**: http://localhost:4321

## 🛠️ Development

### 📋 Available Scripts

```bash
# 🚀 Development
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start only web application
pnpm dev:admin        # Start only admin panel
pnpm dev:backend      # Start only backend API
pnpm dev:mobile       # Start only mobile app
pnpm dev:docs         # Start only documentation

# 🏗️ Building
pnpm build            # Build all apps and packages
pnpm build:packages   # Build only shared packages
pnpm build:web        # Build only web app
pnpm build:admin      # Build only admin panel
pnpm build:docs       # Build only documentation

# 🧪 Testing & Quality
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages

# 🗄️ Database Operations
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:auth          # Generate auth tables
```

### 🔧 Environment System

The monorepo uses a centralized, type-safe environment configuration:

- **🖥️ Server-side**: Import from `@repo/env` 
- **🌐 Client-side**: Import from `@repo/env/client`
- **✅ Validation**: All variables validated with Zod schemas
- **🔍 Auto-detection**: Automatically detects workspace root

### 🗄️ Database Management

Powered by Drizzle ORM with PostgreSQL:

```bash
# 🚀 Quick setup
pnpm db:push          # Push schema to database

# 📝 Migration workflow
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Apply migrations

# 🎨 Visual management
pnpm db:studio        # Open Drizzle Studio UI
```

### 🔐 Authentication System

Comprehensive authentication with Better Auth:

- ✅ **Email/password authentication**
- 🔄 **Session management with refresh tokens**
- 🌐 **CORS configuration for cross-origin requests**
- 👨‍💼 **Separate admin authentication flow**
- 📧 **Email verification and password reset**
- 🔒 **Secure session handling across all apps**

## 📁 Project Structure

```
didactic-funicular/
├── 🎯 apps/
│   ├── 🌐 web/                    # Next.js 15 Web Application
│   │   ├── src/app/              # App Router pages & layouts
│   │   ├── src/components/       # Reusable React components
│   │   ├── src/lib/              # Utilities & configurations
│   │   └── src/middleware.ts     # Next.js middleware
│   ├── ⚡ admin/                  # React Router 7 Admin Panel
│   │   ├── app/routes/           # Admin route components
│   │   ├── app/components/ui/    # shadcn/ui components
│   │   ├── app/lib/              # Admin utilities
│   │   └── app/hooks/            # Custom React hooks
│   ├── 🔌 backend/                # Hono.js API Server
│   │   ├── src/lib/auth.ts       # Better Auth configuration
│   │   ├── src/lib/resend/       # Email service integration
│   │   ├── src/emails/           # React Email templates
│   │   └── src/index.ts          # Server entry point
│   ├── 📱 mobile/                 # Expo React Native App
│   │   ├── app/(auth)/           # Authentication screens
│   │   ├── app/(tabs)/           # Tab navigation screens
│   │   ├── lib/auth-context.tsx  # Auth state management
│   │   └── lib/api.ts            # API client
│   └── 📚 docs/                   # Starlight Documentation
│       ├── src/content/docs/     # Documentation content
│       └── astro.config.mjs      # Astro configuration
├── 📦 packages/
│   ├── 🌍 env/                    # Environment Configuration
│   │   ├── src/index.ts          # Server-side environment
│   │   └── src/client.ts         # Client-side environment
│   └── 🗄️ db/                     # Database Layer
│       ├── src/schema/           # Drizzle ORM schemas
│       ├── src/index.ts          # Database exports
│       └── drizzle.config.ts     # Drizzle configuration
├── 🔧 .github/workflows/         # GitHub Actions
├── 📄 .env                       # Environment variables
├── 📋 pnpm-workspace.yaml        # Workspace configuration
└── 📦 package.json               # Root package configuration
```

## 🔧 Technology Stack

### 🎨 Frontend Technologies
- **⚡ Next.js 15** - React framework with App Router and Turbopack
- **🚦 React Router 7** - Modern client-side routing for admin panel
- **📱 Expo** - Cross-platform React Native framework
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Beautiful, accessible UI components
- **📧 React Email** - Modern email templates with JSX

### 🔌 Backend Technologies
- **⚡ Hono.js** - Ultra-fast web framework for the edge
- **🔐 Better Auth** - Modern authentication library
- **🗄️ Drizzle ORM** - Type-safe TypeScript ORM
- **🐘 PostgreSQL** - Robust relational database
- **📧 Resend** - Modern email delivery service

### 🛠️ Development Tools
- **📘 TypeScript** - Type safety across all packages
- **📦 pnpm** - Fast, disk space efficient package manager
- **⚡ Vite** - Lightning-fast build tool
- **🚀 Turbo** - High-performance build system
- **🎯 Zod** - TypeScript-first schema validation
- **📚 Starlight** - Beautiful documentation framework

## 🔐 Authentication Flow

### 🌐 Web Application (`apps/web`)
1. **🏠 Landing** - User visits authentication pages (`/login`, `/register`, `/verify-email`)
2. **📝 Form Submission** - Forms submit to Better Auth API endpoints
3. **✅ Success** - Successful authentication redirects to dashboard
4. **🔄 State Management** - Client-side auth state via Better Auth React client
5. **🛡️ Protection** - Middleware protects authenticated routes

### ⚡ Admin Panel (`apps/admin`)
1. **🚪 Entry** - Admin visits `/login` route
2. **🔌 API Call** - Direct API call to Better Auth backend
3. **🎯 Redirect** - Success redirects to `/dashboard`
4. **🪝 State Hook** - Auth state managed via custom `useAuth` hook

### 📱 Mobile Application (`apps/mobile`)
1. **📱 Native Auth** - Native authentication screens
2. **🔄 Context** - Auth state managed via React Context
3. **💾 Storage** - Secure token storage with Expo SecureStore
4. **🔄 Auto-refresh** - Automatic token refresh handling

### 🔌 API Endpoints
- `POST /api/auth/sign-in/email` - 🔑 Email/password login
- `POST /api/auth/sign-up/email` - 📝 User registration  
- `POST /api/auth/forget-password` - 🔄 Password reset request
- `POST /api/auth/reset-password` - ✅ Password reset confirmation
- `GET /api/auth/session` - 👤 Get current session
- `POST /api/auth/sign-out` - 🚪 User logout

## 🚀 Deployment

### 🌍 Environment Variables

Complete environment configuration:

```bash
# 🗄️ Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_AUTH_TOKEN=optional_auth_token_for_edge_databases

# 🔐 Authentication Configuration
BETTER_AUTH_SECRET=your_super_secret_key_minimum_32_characters
BETTER_AUTH_URL=https://your-domain.com  # Production URL
BACKEND_URL=https://api.your-domain.com

# 🌐 Client-side Configuration (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com

# 📧 Email Configuration (Optional)
RESEND_API_KEY=re_your_resend_api_key_here

# 🔧 Application Configuration
NODE_ENV=production
PORT=9000
LOG_LEVEL=info
```

### 🏗️ Build Process

```bash
# 🚀 Build everything
pnpm build

# 📦 Individual builds
pnpm build:packages  # Build shared packages first
pnpm build:web       # Build Next.js web app
pnpm build:admin     # Build admin panel
pnpm build:docs      # Build documentation site

# 📱 Mobile build
cd apps/mobile
expo build:android   # Android APK
expo build:ios       # iOS IPA
```

### 🌐 Deployment Platforms

**Recommended deployment platforms:**

- **🌐 Web App**: Vercel, Netlify, or Railway
- **⚡ Admin Panel**: Vercel, Netlify, or any static host
- **🔌 Backend API**: Railway, Render, or Fly.io
- **📚 Documentation**: GitHub Pages (automated via Actions)
- **📱 Mobile**: Expo Application Services (EAS)
- **🗄️ Database**: Neon, Supabase, or PlanetScale

## 📱 Application Features

### 🌐 Web Application
- **🔐 Authentication** - Complete login/register/reset flow
- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS
- **🛡️ Protected Routes** - Middleware-based route protection
- **📧 Email Verification** - Secure email verification system
- **👤 User Dashboard** - Personalized user experience

### ⚡ Admin Panel
- **🎨 Beautiful UI** - shadcn/ui components with dark/light themes
- **📊 Dashboard** - Comprehensive admin dashboard
- **👥 User Management** - Manage users and permissions
- **📈 Analytics** - Built-in analytics and reporting
- **🔧 Settings** - System configuration management

### 📱 Mobile Application
- **📱 Native Feel** - True native experience with Expo
- **🔐 Secure Auth** - Biometric authentication support
- **🔄 Offline Support** - Works offline with data sync
- **📲 Push Notifications** - Real-time notifications
- **🎨 Adaptive UI** - Adapts to iOS and Android design languages

### 📚 Documentation
- **🔍 Searchable** - Full-text search across all docs
- **🎨 Beautiful** - Modern Starlight theme
- **📝 Technical Guides** - Comprehensive technical documentation
- **🔗 Interactive** - Live code examples and API references

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **🍴 Fork** the repository
2. **🌿 Branch** - Create a feature branch: `git checkout -b feature/amazing-feature`
3. **✨ Code** - Make your changes with proper TypeScript types
4. **🧪 Test** - Run tests: `pnpm test`
5. **📝 Commit** - Use conventional commits: `git commit -m 'feat: add amazing feature'`
6. **🚀 Push** - Push to your branch: `git push origin feature/amazing-feature`
7. **📬 PR** - Open a Pull Request with a clear description

### 🎯 Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all apps build successfully

## 📊 Project Stats

- **📦 5 Applications** - Web, Admin, Backend, Mobile, Docs
- **🔧 3 Shared Packages** - Environment, Database, UI
- **🔐 Complete Auth System** - Registration, login, password reset
- **📧 Email Integration** - Verification and notifications
- **🗄️ Type-Safe Database** - Full TypeScript integration
- **📱 Cross-Platform** - Web, iOS, Android support

## 🔗 Links

- **📚 Documentation**: [View Docs](https://pinkycodemasterr.github.io/didactic-funicular/)
- **🐛 Issues**: [Report Issues](https://github.com/PinkyCodeMaster/didactic-funicular/issues)
- **💬 Discussions**: [Join Discussions](https://github.com/PinkyCodeMaster/didactic-funicular/discussions)
- **📋 Project Board**: [View Progress](https://github.com/PinkyCodeMaster/didactic-funicular/projects)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [PinkyCodeMaster](https://github.com/PinkyCodeMaster)

</div>