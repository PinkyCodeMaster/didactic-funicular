# @repo/env

Environment configuration package for the monorepo.

## Usage

```typescript
import env from '@repo/env';

console.log(env.NODE_ENV); // 'development'
console.log(env.PORT); // 9999
console.log(env.DATABASE_URL); // your database URL
```

## Environment Variables

- `NODE_ENV`: Environment mode (default: 'development')
- `PORT`: Server port (default: 9999)
- `LOG_LEVEL`: Logging level ('fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent')
- `DATABASE_URL`: Database connection URL (required)
- `DATABASE_AUTH_TOKEN`: Database auth token (required in production)

## Development

```bash
pnpm build  # Build the package
pnpm dev    # Watch mode for development
```