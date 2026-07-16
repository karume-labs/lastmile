import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@lastmile/db/env";
import * as auth from "@lastmile/db/auth/schema";
import * as identity from "@lastmile/db/identity/schema";
import * as registration from "@lastmile/db/registration/schema";
import * as programmes from "@lastmile/db/programmes/schema";

const schema = {
  ...auth,
  ...identity,
  ...registration,
  ...programmes,
};

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
