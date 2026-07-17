import type {
  IdentityInsertSchema,
  IdentitySelectSchema,
  ProxyInsertSchema,
  ProxySelectSchema,
} from "@lastmile/validators/identity";
import type { z } from "zod/v4";

export type Identity = z.infer<typeof IdentitySelectSchema>;
export type InsertIdentity = z.infer<typeof IdentityInsertSchema>;

export type Proxy = z.infer<typeof ProxySelectSchema>;
export type InsertProxy = z.infer<typeof ProxyInsertSchema>;
