import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BASE_URL as string,
});

export const {
  signIn,
  signOut,
  signUp,
  resetPassword,
  requestPasswordReset,
  useSession,
} = authClient;
