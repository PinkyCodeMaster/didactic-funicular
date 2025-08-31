import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { config } from "./config";

export const authClient = createAuthClient({
  baseURL: config.apiBaseUrl, // Your backend URL - uses IP address for Expo
  plugins: [
    expoClient({
      scheme: config.authScheme, // matches the scheme in app.json
      storagePrefix: config.storagePrefix,
      storage: SecureStore,
    }),
  ],
});