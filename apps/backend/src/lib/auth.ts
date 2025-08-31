import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { db } from "packages-db";
import env from "@repo/env";
import { sendVerificationEmail, sendPasswordResetEmail, sendChangeEmailVerification } from '@/lib/resend';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true if you want to require email verification
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({
                to: user.email,
                resetUrl: url,
            });
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({
                to: user.email,
                verificationUrl: url,
            });
        },
        afterEmailVerification: async (user, request) => {
            console.log(`Email verified for user: ${user.email}`);
        },
    },
    plugins: [
        nextCookies(),
    ],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "mobile://",
    ],
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
                await sendChangeEmailVerification({
                    to: user.email, // Send to current email for approval
                    newEmail,
                    verificationUrl: url,
                });
            },
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url, token }, request) => {
                // You can implement delete account verification email here if needed
                console.log(`Delete account verification requested for: ${user.email}`);
                console.log(`Verification URL: ${url}`);
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
        },
    },
});