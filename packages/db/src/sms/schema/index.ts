import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const smsMessages = sqliteTable(
  "sms_messages",
  {
    id: text("id").primaryKey(),
    recipient: text("recipient").notNull(),
    content: text("content").notNull(),
    status: text("status", { enum: ["pending", "sent", "failed"] })
      .notNull()
      .default("pending"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
  },
  (table) => ({
    recipientIdx: index("sms_messages_recipient_idx").on(table.recipient),
    statusIdx: index("sms_messages_status_idx").on(table.status),
  }),
);
