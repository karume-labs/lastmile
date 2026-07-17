import data from "@lastmile/db/audit/seed/data.json";
import { db } from "@lastmile/db/client";
import { auditLogs } from "@lastmile/db/schemas/audit";

export async function seedAuditLogs() {
  console.log("  Seeding audit logs...");
  let insertedCount = 0;

  for (const item of data.auditLogs) {
    const existing = await db.query.auditLogs.findFirst({
      where: (log, { eq }) => eq(log.id, item.id),
    });

    if (existing) {
      console.log(`    Audit log "${item.id}" (${item.action}) already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(auditLogs).values({
        id: item.id,
        actor: item.actor,
        action: item.action,
        target: item.target,
        severity: item.severity as "info" | "warning" | "critical",
        metadata: item.metadata,
        timestamp: new Date(item.timestamp),
      });
      console.log(`    Inserted audit log "${item.id}" (${item.action}).`);
      insertedCount++;
    } catch (e) {
      console.error(`    Failed to insert audit log "${item.id}"`, e);
    }
  }

  if (insertedCount > 0) {
    console.log(`  Seeded ${insertedCount} audit log(s).`);
  }
}
