# Mobile App

This is an [Expo](https://expo.dev) project with Better Auth integration for authentication.

## Features

- 🔐 **Better Auth Integration**: Complete authentication flow with email/password
- 📱 **Cross-platform**: Works on iOS, Android, and Web
- 🔒 **Secure Storage**: Uses Expo SecureStore for token management
- 🎨 **Modern UI**: Clean, responsive design with React Native
- 🔄 **Auto-sync**: Automatic session management and refresh

## Authentication Features

- Sign in with email and password
- User registration with email verification
- Password reset functionality
- Secure session management
- Automatic token refresh
- Deep linking support for auth flows

## Get Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   - Ensure your backend server is running on port 9000
   - Update the IP address in `lib/config.ts` to match your machine's IP
   - You can find your IP in the Expo terminal output (e.g., `192.168.0.28`)

3. **Update IP address (if needed)**
   ```bash
   pnpm update-ip
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open the app**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `w` to open in web browser
   - Or press `a` for Android emulator / `i` for iOS simulator

## Project Structure

```
apps/mobile/
├── app/
│   ├── (auth)/           # Authentication screens
│   │   ├── sign-in.tsx   # Sign in screen
│   │   ├── sign-up.tsx   # Registration screen
│   │   └── forgot-password.tsx
│   ├── (tabs)/           # Main app tabs
│   │   ├── index.tsx     # Home screen
│   │   ├── profile.tsx   # User profile
│   │   └── explore.tsx   # Explore screen
│   └── _layout.tsx       # Root layout with auth routing
├── lib/
│   ├── auth-client.ts    # Better Auth client configuration
│   ├── auth-context.tsx  # Authentication context provider
│   └── api.ts           # API utilities for authenticated requests
└── metro.config.js      # Metro bundler configuration
```

## Authentication Flow

1. **Unauthenticated users** see the auth screens (`(auth)` group)
2. **Authenticated users** see the main app (`(tabs)` group)
3. **Session management** is handled automatically by Better Auth
4. **Deep linking** works for password reset and social auth flows

## Making Authenticated API Calls

Use the provided API utility for authenticated requests:

```typescript
import { apiRequest, getCurrentSession } from '@/lib/api';

// Get current session
const { data, error } = await getCurrentSession();

// Make custom authenticated request
const result = await apiRequest('/api/user/profile', {
  method: 'PUT',
  body: { name: 'New Name' }
});
```

## Configuration

### Backend Integration

The mobile app connects to your Better Auth backend. Ensure:

1. **Backend is running** on port 9000
2. **IP address is configured** in `lib/config.ts` (use your machine's IP, not localhost)
3. **Expo plugin is installed** in backend: `@better-auth/expo`
4. **Trusted origins** include `mobile://` scheme
5. **CORS is configured** for mobile requests from your IP

### Finding Your IP Address

To find your machine's IP address:
```bash
# On Linux/macOS
hostname -I | awk '{print $1}'

# On Windows
ipconfig | findstr IPv4
```

Or check the Expo terminal output - it shows your IP address in the QR code URL.

### Deep Linking

The app uses the scheme `mobile://` for deep linking. This is configured in:
- `app.json` - Expo configuration
- `lib/auth-client.ts` - Better Auth client
- Backend trusted origins

## Development

### Clear Cache

If you encounter issues, clear the Metro cache:
```bash
pnpm dev --clear
```

### Update Dependencies

Keep Expo SDK and related packages up to date:
```bash
npx expo install --fix
```

### Debugging

- Press `j` in the terminal to open the debugger
- Use React Native Debugger for advanced debugging
- Check network requests in the debugger

## Deployment

### Build for Production

```bash
# Build for all platforms
npx eas build --platform all

# Build for specific platform
npx eas build --platform ios
npx eas build --platform android
```

### Environment Variables

For production, update the `PROD_API_URL` in `lib/config.ts` to point to your production backend.

### IP Address Configuration

**Important**: Expo mobile apps cannot use `localhost` - they need your machine's actual IP address.

1. **Find your IP**: Check the Expo terminal output or run `hostname -I`
2. **Update config**: Modify `DEV_API_URL` in `lib/config.ts`
3. **Update backend CORS**: Ensure your backend allows requests from your IP
4. **Restart servers**: Restart both backend and Expo after IP changes

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Better Auth Expo Integration](https://better-auth.com/docs/integrations/expo)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)