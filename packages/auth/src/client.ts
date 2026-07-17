import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// No baseURL — Better Auth uses relative paths (/api/auth/*)
// so requests always go to the same origin the browser is on.
// This works whether you access via localhost, LAN IP, or a domain.
export const authClient = createAuthClient({
  plugins: [adminClient()],
});
