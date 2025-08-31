import { z } from "zod";

// Client-safe environment variables (only public ones)
const ClientEnvSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: z.string().url().default("http://localhost:9000"),
});

export type ClientEnv = z.infer<typeof ClientEnvSchema>;

// For client-side, we only access NEXT_PUBLIC_ prefixed variables
const clientEnv = {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000",
};

const { data: env, error } = ClientEnvSchema.safeParse(clientEnv);

if (error) {
    console.error("❌ Invalid client env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    throw new Error("Invalid client environment configuration");
}

export default env!;