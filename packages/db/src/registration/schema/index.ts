import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { identities } from "@lastmile/db/identity/schema";

export const registrations = sqliteTable(
  "registrations",
  {
    id: text("id").primaryKey(),
    referenceId: text("reference_id").notNull().unique(),
    identityId: text("identity_id")
      .notNull()
      .references(() => identities.id),
    phoneNumber: text("phone_number").notNull(),
    currency: text("currency").notNull(),
    isProxy: integer("is_proxy", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
  },
  (table) => ({
    identityIdIdx: index("registrations_identityId_idx").on(table.identityId),
    referenceIdIdx: index("registrations_referenceId_idx").on(table.referenceId),
  }),
);

export const registrationsRelations = relations(registrations, ({ one }) => ({
  identity: one(identities, {
    fields: [registrations.identityId],
    references: [identities.id],
  }),
}));
