import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { adminClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import { config } from "./config";
import { ac, founder, manager, admin, employee, customer } from "@repo/permissions";

export const authClient = createAuthClient({
  baseURL: config.apiBaseUrl, // Your backend URL - uses IP address for Expo
  plugins: [
    expoClient({
      scheme: config.authScheme, // matches the scheme in app.json
      storagePrefix: config.storagePrefix,
      storage: SecureStore,
    }),
    adminClient({
      ac: ac as any,
      roles: {
        founder,
        manager,
        admin,
        employee,
        customer,
      },
    }),
  ],
});