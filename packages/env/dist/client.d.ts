import { z } from "zod";
declare const ClientEnvSchema: z.ZodObject<{
    NEXT_PUBLIC_BACKEND_URL: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NEXT_PUBLIC_BACKEND_URL: string;
}, {
    NEXT_PUBLIC_BACKEND_URL?: string | undefined;
}>;
export type ClientEnv = z.infer<typeof ClientEnvSchema>;
declare const _default: {
    NEXT_PUBLIC_BACKEND_URL: string;
};
export default _default;
//# sourceMappingURL=client.d.ts.map