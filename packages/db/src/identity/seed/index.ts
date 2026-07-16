import { db } from "@lastmile/db/client";
import data from "@lastmile/db/identity/seed/data.json";
import { identities, proxies } from "@lastmile/db/schemas/identity";
import { eq } from "drizzle-orm";

export async function seedIdentities() {
  console.log("  Seeding identities & proxies...");
  let identCount = 0;
  let proxyCount = 0;

  for (const item of data.identities) {
    const existing = await db.query.identities.findFirst({
      where: (id, { eq }) => eq(id.id, item.id),
    });

    if (existing) {
      console.log(`    Identity "${item.id}" (${item.fullName}) already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(identities).values({
        id: item.id,
        fullName: item.fullName,
        phoneNumber: item.phoneNumber,
      });
      console.log(`    Inserted identity "${item.fullName}".`);
      identCount++;
    } catch (e) {
      console.error(`    Failed to insert identity "${item.id}"`, e);
    }
  }

  for (const p of data.proxies) {
    const existing = await db.query.proxies.findFirst({
      where: (proxy, { eq }) => eq(proxy.id, p.id),
    });

    if (existing) {
      console.log(`    Proxy "${p.id}" (${p.name}) already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(proxies).values({
        id: p.id,
        name: p.name,
        phone: p.phone,
        status: p.status as "active" | "suspended",
        participantCount: p.participantCount,
        location: p.location,
        role: p.role,
      });
      console.log(`    Inserted proxy "${p.name}".`);
      proxyCount++;
    } catch (e) {
      console.error(`    Failed to insert proxy "${p.id}"`, e);
    }
  }

  if (identCount > 0 || proxyCount > 0) {
    console.log(`  Seeded ${identCount} identity/identities and ${proxyCount} proxy/proxies.`);
  }
}
