import { env } from "@lastmile/auth/env";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  fetchOptions: {
    headers: {
      Origin: env.NEXT_PUBLIC_APP_URL,
    },
  },
  plugins: [adminClient()],
});
