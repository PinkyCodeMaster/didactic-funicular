# Contributing to Oakford

Thank you for your interest in contributing to Oakford! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- PostgreSQL 14.0 or higher
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/oakford.git
   cd oakford
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   cd packages/db
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Build packages and start development**
   ```bash
   pnpm build:packages
   pnpm dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feat/user-authentication`
- `fix/login-redirect-issue`
- `docs/api-reference-update`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

Examples:
```
feat(auth): add password reset functionality
fix(web): resolve login redirect issue
docs(api): update authentication endpoints
refactor(db): improve query performance
test(admin): add unit tests for dashboard
chore(deps): update dependencies
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   pnpm test
   pnpm lint
   pnpm typecheck
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a descriptive title
   - Provide detailed description
   - Link related issues
   - Add screenshots if applicable

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide proper type annotations
- Use interfaces for object shapes
- Prefer `const` assertions where appropriate

### React Components

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries where needed
- Use memo for performance optimization

### File Organization

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── hooks/              # Custom hooks
├── lib/                # Utilities and configurations
├── types/              # Type definitions
└── styles/             # Styling files
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserData`, `ApiResponse`)

## Testing Guidelines

### Unit Tests

- Write tests for all new functions and components
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies

```typescript
describe('UserProfile', () => {
  it('should display user information correctly', () => {
    // Test implementation
  });

  it('should handle loading state', () => {
    // Test implementation
  });

  it('should handle error state', () => {
    // Test implementation
  });
});
```

### Integration Tests

- Test API endpoints
- Test database operations
- Test authentication flows
- Test cross-component interactions

### E2E Tests

- Test critical user journeys
- Test authentication flows
- Test responsive design
- Test accessibility

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex logic
- Include usage examples
- Keep comments up to date

```typescript
/**
 * Authenticates a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to user data or error
 * @example
 * ```typescript
 * const user = await authenticateUser('user@example.com', 'password123');
 * ```
 */
async function authenticateUser(email: string, password: string): Promise<User> {
  // Implementation
}
```

### README Updates

- Update relevant README files
- Include setup instructions
- Document new features
- Provide usage examples

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Update OpenAPI specifications

## Package-Specific Guidelines

### Web App (`apps/web`)

- Follow Next.js best practices
- Use App Router for new pages
- Implement proper SEO
- Ensure responsive design
- Use server components where appropriate

### Admin Panel (`apps/admin`)

- Use React Router 7 patterns
- Follow shadcn/ui conventions
- Implement proper error handling
- Ensure accessibility
- Use form validation

### Backend (`apps/backend`)

- Follow Hono.js patterns
- Implement proper error handling
- Use middleware appropriately
- Validate all inputs
- Document API endpoints

### Mobile App (`apps/mobile`)

- Follow Expo best practices
- Implement proper navigation
- Handle offline scenarios
- Test on both platforms
- Follow platform guidelines

### Shared Packages

- Keep packages focused and minimal
- Provide clear APIs
- Include comprehensive tests
- Document usage patterns
- Maintain backward compatibility

## Security Guidelines

### Authentication

- Never store passwords in plain text
- Use secure session management
- Implement proper CSRF protection
- Validate all user inputs
- Use HTTPS in production

### Data Handling

- Sanitize user inputs
- Use parameterized queries
- Implement proper access controls
- Log security events
- Follow GDPR guidelines

### Dependencies

- Keep dependencies updated
- Audit for security vulnerabilities
- Use trusted packages only
- Review dependency licenses
- Monitor for security advisories

## Performance Guidelines

### Frontend Performance

- Optimize bundle sizes
- Use code splitting
- Implement lazy loading
- Optimize images
- Use proper caching strategies

### Backend Performance

- Optimize database queries
- Use connection pooling
- Implement caching
- Monitor response times
- Use proper indexing

### Database Performance

- Design efficient schemas
- Use appropriate indexes
- Optimize query patterns
- Monitor query performance
- Implement proper pagination

## Accessibility Guidelines

### Web Accessibility

- Follow WCAG 2.1 guidelines
- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Mobile Accessibility

- Follow platform accessibility guidelines
- Provide proper labels
- Ensure touch targets are adequate
- Support assistive technologies
- Test with accessibility tools

## Review Process

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Accessibility requirements met
- [ ] Breaking changes documented

### Review Criteria

- **Functionality**: Does the code work as intended?
- **Quality**: Is the code clean and maintainable?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Testing**: Are tests comprehensive and meaningful?
- **Documentation**: Is the code properly documented?

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Deployment tested

## Getting Help

### Resources

- **Documentation**: Check the docs app at `apps/docs`
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our Discord server for real-time help

### Reporting Issues

When reporting issues:

1. Check if the issue already exists
2. Use the issue template
3. Provide detailed reproduction steps
4. Include environment information
5. Add relevant logs or screenshots

### Asking Questions

- Use GitHub Discussions for general questions
- Use Discord for real-time help
- Be specific about your problem
- Provide context and examples
- Be patient and respectful

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints
- Help others learn and grow

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information
- Spam or off-topic content

### Enforcement

Violations of the code of conduct will result in:

1. Warning
2. Temporary ban
3. Permanent ban

Report violations to the maintainers.

## Recognition

Contributors will be recognized through:

- GitHub contributor graphs
- Release notes mentions
- Hall of fame in documentation
- Special contributor badges
- Community highlights

Thank you for contributing to Oakford! 🎉