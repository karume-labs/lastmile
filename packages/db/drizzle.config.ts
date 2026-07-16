import { env } from "@lastmile/db/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/*/schema/*.ts",
  out: "./src/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
