---
title: Introduction
description: Learn about the Oakford platform architecture and features.
---

# Introduction to Oakford

Oakford is a modern, full-stack platform built as a monorepo containing multiple applications and shared packages. It provides a complete solution for building web, mobile, and admin applications with shared authentication, database, and UI components.

## Key Features

### 🔐 Authentication System
- **Better Auth Integration**: Secure authentication with email/password, social logins, and session management
- **Multi-app Support**: Shared authentication across web, mobile, and admin applications
- **Role-based Access**: Admin and user roles with proper authorization

### 🏗️ Monorepo Architecture
- **Shared Packages**: Centralized environment configuration, database layer, and UI components
- **Type Safety**: Full TypeScript support across all applications and packages
- **Development Experience**: Hot reload, shared tooling, and consistent development workflow

### 🌐 Multi-Platform Support
- **Web Application**: Next.js 15 with App Router and server-side rendering
- **Mobile Application**: Expo React Native for iOS and Android
- **Admin Panel**: React Router 7 with modern routing and data loading
- **Backend API**: Hono.js with high performance and edge runtime support

### 🎨 Modern UI/UX
- **Design System**: shadcn/ui components with Tailwind CSS
- **Responsive Design**: Mobile-first approach across all applications
- **Dark Mode**: Built-in theme switching support
- **Accessibility**: WCAG compliant components and interactions

## Technology Stack

### Frontend Technologies
- **Next.js 15**: React framework with App Router and server components
- **React Router 7**: Modern routing with data loading and actions
- **Expo**: React Native framework for mobile development
- **TypeScript**: Full type safety and developer experience

### Backend Technologies
- **Hono.js**: Fast, lightweight web framework
- **Better Auth**: Modern authentication library
- **Drizzle ORM**: Type-safe database queries and migrations
- **PostgreSQL**: Robust relational database

### Development Tools
- **pnpm**: Fast, efficient package manager with workspace support
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **ESLint & Prettier**: Code quality and formatting

## Project Structure

```
oakford/
├── apps/
│   ├── web/          # Next.js customer application
│   ├── admin/        # React Router admin panel
│   ├── backend/      # Hono.js API server
│   ├── mobile/       # Expo React Native app
│   └── docs/         # Starlight documentation site
├── packages/
│   ├── env/          # Environment configuration with Zod validation
│   ├── db/           # Drizzle ORM database layer
│   └── ui/           # Shared React UI components
├── package.json      # Workspace configuration
└── pnpm-workspace.yaml
```

## Development Philosophy

### Type Safety First
Every part of the system is built with TypeScript, ensuring compile-time error detection and excellent developer experience with autocomplete and refactoring support.

### Shared by Default
Common functionality like authentication, database access, and UI components are shared across applications to reduce duplication and ensure consistency.

### Modern Standards
The platform uses the latest stable versions of frameworks and follows current best practices for security, performance, and maintainability.

### Developer Experience
Fast development cycles with hot reload, comprehensive error messages, and integrated tooling make development productive and enjoyable.

## Next Steps

- [Quick Start Guide](/getting-started/quick-start/) - Get the platform running locally
- [Architecture Overview](/getting-started/architecture/) - Understand the system design
- [Development Setup](/internal/development-setup/) - Detailed development environment setup