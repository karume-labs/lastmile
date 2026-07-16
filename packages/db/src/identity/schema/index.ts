import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const identities = sqliteTable("identities", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const proxies = sqliteTable("proxies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  status: text("status", { enum: ["active", "suspended"] })
    .notNull()
    .default("active"),
  participantCount: integer("participant_count").notNull().default(0),
  location: text("location").notNull().default("Unknown"),
  role: text("role").notNull().default("Field Agent"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});
