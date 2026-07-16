import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clawbackLogs = sqliteTable("clawback_logs", {
  id: text("id").primaryKey(),
  paymentId: text("payment_id").notNull(),
  transactionHash: text("transaction_hash"),
  executedBy: text("executed_by"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});
