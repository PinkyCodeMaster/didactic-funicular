import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import env from "@repo/env/client"
import { ac, founder, manager, admin, employee, customer } from "../../backend/src/lib/permissions"

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BACKEND_URL,
    plugins: [
        adminClient({
            ac,
            roles: {
                founder,
                manager,
                admin,
                employee,
                customer,
            },
        }),
    ],
})