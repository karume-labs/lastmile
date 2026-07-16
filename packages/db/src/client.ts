import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as audit from "./audit/schema/index";
import { env } from "./env";
import * as identity from "./identity/schema/index";
import * as programmes from "./programmes/schema/index";
import * as registration from "./registration/schema/index";
import * as auth from "./schema/auth";

const schema = {
  ...auth,
  ...identity,
  ...registration,
  ...programmes,
  ...audit,
};

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
