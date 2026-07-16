import { env } from "./env";
import * as auth from "./auth/schema/index";
import * as identity from "./identity/schema/index";
import * as programmes from "./programmes/schema/index";
import * as registration from "./registration/schema/index";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

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
