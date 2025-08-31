import { z } from "zod";
declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodString>;
    PORT: z.ZodDefault<z.ZodNumber>;
    LOG_LEVEL: z.ZodEnum<["fatal", "error", "warn", "info", "debug", "trace", "silent"]>;
    DATABASE_URL: z.ZodString;
    DATABASE_AUTH_TOKEN: z.ZodOptional<z.ZodString>;
    BETTER_AUTH_SECRET: z.ZodString;
    BETTER_AUTH_URL: z.ZodString;
    BACKEND_URL: z.ZodDefault<z.ZodString>;
    RESEND_API_KEY: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: string;
    PORT: number;
    LOG_LEVEL: "error" | "fatal" | "warn" | "info" | "debug" | "trace" | "silent";
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    BACKEND_URL: string;
    RESEND_API_KEY: string;
    DATABASE_AUTH_TOKEN?: string | undefined;
}, {
    LOG_LEVEL: "error" | "fatal" | "warn" | "info" | "debug" | "trace" | "silent";
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    RESEND_API_KEY: string;
    NODE_ENV?: string | undefined;
    PORT?: number | undefined;
    DATABASE_AUTH_TOKEN?: string | undefined;
    BACKEND_URL?: string | undefined;
}>;
export type env = z.infer<typeof EnvSchema>;
declare const _default: {
    NODE_ENV: string;
    PORT: number;
    LOG_LEVEL: "error" | "fatal" | "warn" | "info" | "debug" | "trace" | "silent";
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    BACKEND_URL: string;
    RESEND_API_KEY: string;
    DATABASE_AUTH_TOKEN?: string | undefined;
};
export default _default;
//# sourceMappingURL=index.d.ts.map