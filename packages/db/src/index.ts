import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "./env";
import * as authSchema from "./schema/auth";

const schema = {
  ...authSchema,
};

export const createDbClient = () => {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
};

export const db = createDbClient();
export { schema };
