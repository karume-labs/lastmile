import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const programmes = sqliteTable("programmes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  targetCurrency: text("target_currency").notNull(),
  targetAudience: text("target_audience").notNull().default(""),
  budget: real("budget").notNull().default(0),
  startDate: integer("start_date", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  endDate: integer("end_date", { mode: "timestamp" }),
  status: text("status", { enum: ["Active", "Completed", "Draft"] })
    .notNull()
    .default("Active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const batches = sqliteTable("batches", {
  id: text("id").primaryKey(),
  programmeId: text("programme_id").notNull(),
  size: integer("size").notNull(),
  status: text("status", { enum: ["pending", "processed", "completed"] })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const disbursements = sqliteTable(
  "disbursements",
  {
    id: text("id").primaryKey(),
    referenceId: text("reference_id").notNull(),
    participantName: text("participant_name").notNull().default(""),
    programmeName: text("programme_name").notNull().default(""),
    amount: real("amount").notNull(),
    currency: text("currency").notNull().default("USDC"),
    status: text("status", {
      enum: ["pending", "sent", "delivered", "failed", "claimed", "stagnant", "clawed_back"],
    })
      .notNull()
      .default("pending"),
    deliveryMethod: text("delivery_method", { enum: ["direct", "proxy-led"] })
      .notNull()
      .default("direct"),
    otpHash: text("otp_hash"),
    txHash: text("tx_hash"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
  },
  (table) => ({
    referenceIdIdx: index("disbursements_referenceId_idx").on(table.referenceId),
    statusIdx: index("disbursements_status_idx").on(table.status),
  }),
);
