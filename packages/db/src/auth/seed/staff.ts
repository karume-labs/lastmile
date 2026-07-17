import data from "@lastmile/db/auth/seed/data.json";
import { db } from "@lastmile/db/client";
import { user } from "@lastmile/db/schemas/auth";

export async function seedStaff() {
  console.log("  Seeding staff & field agent accounts...");
  let insertedCount = 0;

  for (const u of data.users) {
    const existing = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, u.email),
    });

    if (existing) {
      console.log(`    User "${u.email}" already exists, skipping.`);
      continue;
    }

    try {
      await db.insert(user).values({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
      });
      console.log(`    Inserted "${u.email}" (${u.role}).`);
      insertedCount++;
    } catch (e) {
      console.error(`    Failed to insert "${u.email}"`, e);
    }
  }

  if (insertedCount > 0) {
    console.log(`  Seeded ${insertedCount} account(s).`);
  }
}
