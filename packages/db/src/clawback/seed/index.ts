import data from "@lastmile/db/clawback/seed/data.json";
import { db } from "@lastmile/db/client";
import { clawbackLogs } from "@lastmile/db/schemas/clawback";

export async function seedClawbackLogs() {
  console.log("  Seeding clawback logs...");
  let insertedCount = 0;

  for (const item of data.clawbackLogs) {
    const existing = await db.query.clawbackLogs.findFirst({
      where: (log, { eq }) => eq(log.id, item.id),
    });

    if (existing) {
      console.log(
        `    Clawback log "${item.id}" (payment: ${item.paymentId}) already exists, skipping.`,
      );
      continue;
    }

    try {
      await db.insert(clawbackLogs).values({
        id: item.id,
        paymentId: item.paymentId,
        transactionHash: item.transactionHash,
        executedBy: item.executedBy,
        createdAt: new Date(item.createdAt),
      });
      console.log(`    Inserted clawback log "${item.id}".`);
      insertedCount++;
    } catch (e) {
      console.error(`    Failed to insert clawback log "${item.id}"`, e);
    }
  }

  if (insertedCount > 0) {
    console.log(`  Seeded ${insertedCount} clawback log(s).`);
  }
}
