import { z } from "zod";
declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodString>;
    PORT: z.ZodDefault<z.ZodNumber>;
    LOG_LEVEL: z.ZodEnum<["fatal", "error", "warn", "info", "debug", "trace", "silent"]>;
    DATABASE_URL: z.ZodString;
    DATABASE_AUTH_TOKEN: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: string;
    PORT: number;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
    DATABASE_URL: string;
    DATABASE_AUTH_TOKEN?: string | undefined;
}, {
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
    DATABASE_URL: string;
    NODE_ENV?: string | undefined;
    PORT?: number | undefined;
    DATABASE_AUTH_TOKEN?: string | undefined;
}>;
export type env = z.infer<typeof EnvSchema>;
declare const _default: {
    NODE_ENV: string;
    PORT: number;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
    DATABASE_URL: string;
    DATABASE_AUTH_TOKEN?: string | undefined;
};
export default _default;
//# sourceMappingURL=index.d.ts.map