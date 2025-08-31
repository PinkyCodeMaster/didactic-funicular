import Constants from 'expo-constants';

/**
 * Get the appropriate API base URL for the current environment
 * 
 * For Expo development:
 * - Use your machine's IP address instead of localhost
 * - The IP should match what Expo shows in the terminal
 */
function getApiBaseUrl(): string {
  // In development, use your machine's IP address
  // You can find this in the Expo terminal output
  const DEV_API_URL = 'http://192.168.0.28:9000';
  
  // For production, use your production API URL
  const PROD_API_URL = 'https://your-api-domain.com';
  
  // Use production URL if in production mode
  if (Constants.expoConfig?.extra?.environment === 'production') {
    return PROD_API_URL;
  }
  
  return DEV_API_URL;
}

export const API_BASE_URL = getApiBaseUrl();

export const config = {
  apiBaseUrl: API_BASE_URL,
  authScheme: 'mobile',
  storagePrefix: 'mobile-auth',
} as const;