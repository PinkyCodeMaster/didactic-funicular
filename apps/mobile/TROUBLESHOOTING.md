# Mobile App Troubleshooting

## Common Issues and Solutions

### 🌐 Network Connection Issues

#### Problem: "Network request failed" or "Unable to connect"

**Solution 1: Update IP Address**
```bash
pnpm update-ip
```

**Solution 2: Manual IP Configuration**
1. Find your IP address:
   ```bash
   # Linux/macOS
   hostname -I | awk '{print $1}'
   
   # Windows
   ipconfig | findstr IPv4
   ```

2. Update `lib/config.ts`:
   ```typescript
   const DEV_API_URL = 'http://YOUR_IP_HERE:9000';
   ```

3. Restart Expo dev server

#### Problem: CORS errors in browser console

**Solution**: Ensure backend CORS is configured correctly
- Backend should listen on `0.0.0.0:9000` (all interfaces)
- CORS should allow your IP address
- Check `apps/backend/src/index.ts`

### 📱 Expo-Specific Issues

#### Problem: App shows blank screen or loading forever

**Possible Causes & Solutions**:

1. **Backend not running**
   ```bash
   cd apps/backend
   pnpm dev
   ```

2. **Wrong IP address**
   ```bash
   pnpm update-ip
   ```

3. **Metro cache issues**
   ```bash
   pnpm dev --clear
   ```

4. **Package exports not enabled**
   - Check `metro.config.js` has `unstable_enablePackageExports: true`

#### Problem: Authentication not working

**Check these items**:

1. **Backend has Expo plugin**:
   ```typescript
   // apps/backend/src/lib/auth.ts
   import { expo } from "@better-auth/expo";
   
   export const auth = betterAuth({
     plugins: [expo()],
     // ...
   });
   ```

2. **Trusted origins include mobile scheme**:
   ```typescript
   trustedOrigins: [
     "http://localhost:3000",
     "mobile://", // This is important!
   ]
   ```

3. **Secure storage is working**:
   - Check if `expo-secure-store` is installed
   - Try clearing app data/cache

### 🔧 Development Environment

#### Problem: Different IP address after network change

**Solution**: Run the update script again
```bash
pnpm update-ip
```

#### Problem: Can't access from physical device

**Checklist**:
- [ ] Device and computer on same WiFi network
- [ ] Firewall allows connections on port 9000
- [ ] Backend listening on `0.0.0.0` not just `localhost`
- [ ] IP address is correct in config

### 🐛 Debugging Tips

#### Enable Network Debugging

1. **In Expo Dev Tools**:
   - Press `j` to open debugger
   - Check Network tab for failed requests

2. **In React Native Debugger**:
   - Install React Native Debugger
   - Enable network inspect

3. **Console Logging**:
   ```typescript
   // Add to lib/api.ts
   console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
   ```

#### Check Backend Logs

```bash
cd apps/backend
pnpm dev
# Watch for incoming requests and errors
```

#### Verify Configuration

```bash
# Check current IP
hostname -I

# Test backend connectivity
curl http://192.168.0.28:9000/api/auth/get-session

# Check if backend is accessible from network
ping 192.168.0.28
```

### 📋 Quick Checklist

When setting up mobile development:

- [ ] Backend running on port 9000
- [ ] Backend listening on `0.0.0.0` (all interfaces)
- [ ] IP address updated in mobile config
- [ ] CORS configured for local network
- [ ] Expo plugin installed in backend
- [ ] Mobile scheme in trusted origins
- [ ] Both devices on same WiFi network
- [ ] Firewall allows port 9000

### 🆘 Still Having Issues?

1. **Check Expo logs**: Look for error messages in the terminal
2. **Restart everything**: Backend, Expo dev server, and clear cache
3. **Try web version**: Test auth on `http://192.168.0.28:8081` in browser
4. **Check network**: Ensure devices can communicate

### 📞 Getting Help

If you're still stuck:
1. Check the error messages in Expo dev tools
2. Look at backend server logs
3. Verify network connectivity between devices
4. Try the web version to isolate mobile-specific issues