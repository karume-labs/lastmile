import { db } from "@lastmile/db/client";
import data from "@lastmile/db/programmes/seed/data.json";
import { batches, disbursements, programmes } from "@lastmile/db/schemas/programmes";
import { eq } from "drizzle-orm";

export async function seedProgrammes() {
  console.log("  Seeding programmes, batches & disbursements...");
  let progCount = 0;
  let batchCount = 0;
  let disbCount = 0;

  for (const p of data.programmes) {
    const existing = await db.query.programmes.findFirst({
      where: (prog, { eq }) => eq(prog.id, p.id),
    });

    if (existing) {
      console.log(`    Programme "${p.name}" already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(programmes).values({
        id: p.id,
        name: p.name,
        targetCurrency: p.targetCurrency,
        targetAudience: p.targetAudience,
        budget: p.budget,
        status: p.status as "Active" | "Completed" | "Draft",
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
      });
      console.log(`    Inserted programme "${p.name}".`);
      progCount++;
    } catch (e) {
      console.error(`    Failed to insert programme "${p.id}"`, e);
    }
  }

  for (const b of data.batches) {
    const existing = await db.query.batches.findFirst({
      where: (batch, { eq }) => eq(batch.id, b.id),
    });

    if (existing) {
      console.log(`    Batch "${b.id}" already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(batches).values({
        id: b.id,
        programmeId: b.programmeId,
        size: b.size,
        status: b.status as "pending" | "processed" | "completed",
      });
      console.log(`    Inserted batch "${b.id}".`);
      batchCount++;
    } catch (e) {
      console.error(`    Failed to insert batch "${b.id}"`, e);
    }
  }

  for (const d of data.disbursements) {
    const existing = await db.query.disbursements.findFirst({
      where: (disb, { eq }) => eq(disb.id, d.id),
    });

    if (existing) {
      console.log(`    Disbursement "${d.id}" (${d.participantName}) already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(disbursements).values({
        id: d.id,
        referenceId: d.referenceId,
        participantName: d.participantName,
        programmeName: d.programmeName,
        amount: d.amount,
        currency: d.currency,
        status: d.status as
          | "pending"
          | "sent"
          | "delivered"
          | "failed"
          | "claimed"
          | "stagnant"
          | "clawed_back",
        deliveryMethod: d.deliveryMethod as "direct" | "proxy-led",
        otpHash: d.otpHash,
      });
      console.log(`    Inserted disbursement for "${d.participantName}" (${d.amount} ${d.currency}).`);
      disbCount++;
    } catch (e) {
      console.error(`    Failed to insert disbursement "${d.id}"`, e);
    }
  }

  if (progCount > 0 || batchCount > 0 || disbCount > 0) {
    console.log(
      `  Seeded ${progCount} programme(s), ${batchCount} batch(es), and ${disbCount} disbursement(s).`,
    );
  }
}
