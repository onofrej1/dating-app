import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BASE_URL as string,
    plugins: [
        adminClient()
    ]
});

export const {
    signIn,
    signOut,
    signUp,
    resetPassword,
    requestPasswordReset,
    useSession
} = authClient;