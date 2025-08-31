import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import fs from "node:fs";
import { z } from "zod";

function findWorkspaceRoot(): string {
    let currentDir = process.cwd();

    while (currentDir !== path.dirname(currentDir)) {
        try {
            const packageJsonPath = path.join(currentDir, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            if (packageJson.workspaces || packageJson.name === 'oakford') {
                return currentDir;
            }
        } catch {
            // Continue searching
        }
        currentDir = path.dirname(currentDir);
    }

    return process.cwd();
}

const workspaceRoot = findWorkspaceRoot();

expand(config({
    path: path.resolve(workspaceRoot, process.env.NODE_ENV === "test" ? ".env.test" : ".env"),
}));

const EnvSchema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().default(9000),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),
    BACKEND_URL: z.string().url().default("http://localhost:9000"),
    RESEND_API_KEY: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

export default env!;