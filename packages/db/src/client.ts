import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as audit from "@lastmile/db/schemas/audit";
import { env } from "@lastmile/db/env";
import * as identity from "@lastmile/db/schemas/identity";
import * as programmes from "@lastmile/db/schemas/programmes";
import * as registration from "@lastmile/db/schemas/registration";
import * as auth from "@lastmile/db/schemas/auth";
import * as sms from "@lastmile/db/schemas/sms";

const schema = {
  ...auth,
  ...identity,
  ...registration,
  ...programmes,
  ...audit,
  ...sms,
};

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
