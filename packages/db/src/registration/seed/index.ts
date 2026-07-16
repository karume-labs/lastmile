import { db } from "@lastmile/db/client";
import data from "@lastmile/db/registration/seed/data.json";
import { registrations } from "@lastmile/db/schemas/registration";
import { eq } from "drizzle-orm";

export async function seedRegistrations() {
  console.log("  Seeding registrations...");
  let insertedCount = 0;

  for (const item of data.registrations) {
    const existing = await db.query.registrations.findFirst({
      where: (reg, { eq }) => eq(reg.referenceId, item.referenceId),
    });

    if (existing) {
      console.log(`    Registration "${item.referenceId}" already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(registrations).values({
        id: item.id,
        referenceId: item.referenceId,
        identityId: item.identityId,
        programmeId: item.programmeId,
        currency: item.currency,
        preferredLanguage: item.preferredLanguage as "en" | "sw" | "tu",
        isProxy: item.isProxy,
      });
      console.log(`    Inserted registration "${item.referenceId}".`);
      insertedCount++;
    } catch (e) {
      console.error(`    Failed to insert registration "${item.referenceId}"`, e);
    }
  }

  if (insertedCount > 0) {
    console.log(`  Seeded ${insertedCount} registration(s).`);
  }
}
