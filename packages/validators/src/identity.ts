import { identities, proxies } from "@lastmile/db/schemas/identity";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const IdentityInsertSchema = createInsertSchema(identities);
export const IdentitySelectSchema = createSelectSchema(identities);

export const ProxyInsertSchema = createInsertSchema(proxies);
export const ProxySelectSchema = createSelectSchema(proxies);
