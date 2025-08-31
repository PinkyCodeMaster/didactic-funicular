import { createAuthClient } from "better-auth/react"
import env from "@repo/env/client"

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BACKEND_URL
})

export { authClient as auth }