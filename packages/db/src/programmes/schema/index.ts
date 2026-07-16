import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const disbursements = sqliteTable(
  "disbursements",
  {
    id: text("id").primaryKey(),
    referenceId: text("reference_id").notNull(),
    amount: real("amount").notNull(),
    status: text("status", {
      enum: ["pending", "claimed", "stagnant", "clawed_back"],
    })
      .notNull()
      .default("pending"),
    otpHash: text("otp_hash"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
  },
  (table) => ({
    referenceIdIdx: index("disbursements_referenceId_idx").on(table.referenceId),
    statusIdx: index("disbursements_status_idx").on(table.status),
  }),
);
