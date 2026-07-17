import { db } from "@lastmile/db/client";
import { smsMessages } from "@lastmile/db/schemas/sms";
import data from "@lastmile/db/sms/seed/data.json";

export async function seedSmsMessages() {
  console.log("  Seeding SMS messages...");
  let insertedCount = 0;

  for (const item of data.smsMessages) {
    const existing = await db.query.smsMessages.findFirst({
      where: (sms, { eq }) => eq(sms.id, item.id),
    });

    if (existing) {
      console.log(`    SMS "${item.id}" to ${item.recipient} already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(smsMessages).values({
        id: item.id,
        recipient: item.recipient,
        content: item.content,
        status: item.status as "pending" | "sent" | "failed",
      });
      console.log(`    Inserted SMS "${item.id}" (${item.status}).`);
      insertedCount++;
    } catch (e) {
      console.error(`    Failed to insert SMS "${item.id}"`, e);
    }
  }

  if (insertedCount > 0) {
    console.log(`  Seeded ${insertedCount} SMS message(s).`);
  }
}
