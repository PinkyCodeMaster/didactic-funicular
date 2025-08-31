---
title: Development Setup
description: Internal development environment setup guide
---

# Development Setup

This guide covers the internal development environment setup for the Oakford platform.

## Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- PostgreSQL 14.0 or higher
- Git

## Quick Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables
4. Build shared packages
5. Start development servers

For detailed instructions, see the [Technical Development Guide](/technical/development/).

## Environment Configuration

Create a `.env` file in the root directory with the required environment variables.

## Database Setup

Set up PostgreSQL and run the database migrations using the database package.

## Starting Development

Use `pnpm dev` to start all development servers simultaneously.