import { db } from "@lastmile/db/client";
import { account, session, user, verification } from "@lastmile/db/schemas/auth";
import { env } from "@lastmile/db/seed/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export async function seedSuperAdmin() {
  console.log("  Seeding super administrator account...");

  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("    Skipping super admin seed: ADMIN_EMAIL or ADMIN_PASSWORD not set.");
    return;
  }

  const seedAuth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: { user, account, session, verification },
    }),
    emailAndPassword: { enabled: true },
    baseURL: env.API_URL || "http://localhost:3000/auth",
    plugins: [admin()],
  });

  const existingAdmins = await db.query.user.findMany({
    where: (users, { eq }) => eq(users.email, adminEmail),
  });

  if (existingAdmins.length > 0) {
    console.log("    Admin account already exists. Updating role to super_admin...");
    await db.update(user).set({ role: "super_admin" }).where(eq(user.id, existingAdmins[0].id));
    console.log("    Super admin account updated successfully!");
    return;
  }

  const response = await seedAuth.api.signUpEmail({
    body: {
      email: adminEmail,
      password: adminPassword,
      name: "Super Administrator",
    },
    headers: new Headers(),
  });

  if (response?.user) {
    await db.update(user).set({ role: "super_admin" }).where(eq(user.id, response.user.id));
    console.log("    Super administrator account successfully seeded with role 'super_admin'.");
  } else {
    console.error("    Failed to create super administrator account.");
  }
}
