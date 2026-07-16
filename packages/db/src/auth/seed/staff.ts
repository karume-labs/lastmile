import { db } from "@lastmile/db/client";
import { user } from "../schema";

export async function seedStaff() {
  console.log("Seeding staff members...");

  const staffData = [
    {
      id: "staff-1",
      name: "Jane Doe (Staff)",
      email: "jane.doe@lastmile.com",
      role: "staff" as const,
      emailVerified: true,
    },
    {
      id: "staff-2",
      name: "John Smith (Admin)",
      email: "john.smith@lastmile.com",
      role: "admin" as const,
      emailVerified: true,
    },
  ];

  for (const staff of staffData) {
    try {
      await db
        .insert(user)
        .values(staff)
        .onConflictDoNothing();
      console.log(`Inserted ${staff.email} as ${staff.role}`);
    } catch (e) {
      console.error(`Failed to insert ${staff.email}`, e);
    }
  }
}
