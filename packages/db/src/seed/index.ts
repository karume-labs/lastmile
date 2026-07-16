import { createInterface } from "node:readline";
import { seedSuperAdmin } from "@lastmile/db/auth/seed";
import { db } from "@lastmile/db/client";
import { env } from "@lastmile/db/seed/env";
import { sql } from "drizzle-orm";

// Entity flags that can be passed via CLI (e.g., --auth)
// Future entities (e.g. "identities", "registrations", "programmes") will be added to this list
const ENTITY_FLAGS = ["auth"] as const;

type Entity = (typeof ENTITY_FLAGS)[number];

function printUsage() {
  console.log(`
Usage: bun run db:seed [options]

Options:
  --auth           Seed super admin user from ADMIN_EMAIL and ADMIN_PASSWORD
  --force, -f      Clear all data before seeding
  --help, -h       Show this help message

If no entity flags are specified, all connected entities are seeded.
Currently connected seeders:
  - auth (Super Admin)
Future entities (` +
	"`identities`" +
	`, ` +
	"`registrations`" +
	`, ` +
	"`programmes`" +
	`) will be connected here as they are created.
`);
}

async function askForConfirmation(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} (Y/n) `, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      if (trimmed === "" || trimmed === "y" || trimmed === "yes") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function clearAllData() {
  const tables = [
    "audit_logs",
    "sms_messages",
    "batches",
    "disbursements",
    "programmes",
    "registrations",
    "proxies",
    "identities",
    "account",
    "session",
    "verification",
    "user",
  ];
  for (const table of tables) {
    try {
      await db.run(sql.raw(`DELETE FROM "${table}"`));
    } catch {
      // Ignore if table doesn't exist yet
    }
  }
}

// Orchestrates seeding across all domain entities.
// Currently connected: auth (Super Admin seeding)
// Future seed functions (e.g. seedIdentities, seedProgrammes) will be registered below in order.
const SEED_ORDER: { flag: Entity; label: string; fn: () => Promise<void> }[] = [
  { flag: "auth", label: "Super Admin (Auth)", fn: seedSuperAdmin },
  // { flag: "identities", label: "Identities", fn: seedIdentities },
  // { flag: "registrations", label: "Registrations", fn: seedRegistrations },
  // { flag: "programmes", label: "Programmes & Disbursements", fn: seedProgrammes },
];

async function main() {
  const args = process.argv.slice(2);
  const hasForce = args.includes("--force") || args.includes("-f");
  const hasHelp = args.includes("--help") || args.includes("-h");

  const requestedEntities = args
    .filter(
      (a): a is Entity =>
        a.startsWith("--") &&
        !a.startsWith("--no-") &&
        !["--force", "-f", "--help", "-h"].includes(a) &&
        ENTITY_FLAGS.includes(a.replace(/^--/, "") as Entity),
    )
    .map((a) => a.replace(/^--/, "") as Entity);

  const unknownFlags = args.filter(
    (a) =>
      a.startsWith("--") &&
      !["--force", "-f", "--help", "-h"].includes(a) &&
      !ENTITY_FLAGS.includes(a.replace(/^--/, "") as Entity),
  );

  if (hasHelp) {
    printUsage();
    process.exit(0);
  }

  if (unknownFlags.length > 0) {
    console.error(`Unknown flag(s): ${unknownFlags.join(", ")}\n`);
    printUsage();
    process.exit(1);
  }

  const seedAll = requestedEntities.length === 0;

  if (hasForce) {
    if (env.NODE_ENV === "production") {
      console.log("\n⚠  PRODUCTION ENVIRONMENT DETECTED ⚠\n");
    }
    const confirmed = await askForConfirmation(
      "⚠  This will DELETE all existing data and re-seed from scratch",
    );
    if (!confirmed) {
      console.log("Aborted.");
      process.exit(0);
    }
    console.log("Clearing all data before seeding...");
    await clearAllData();
    console.log();
  }

  if (seedAll) {
    console.log("Seeding all entities...\n");
  } else {
    console.log(`Seeding: ${requestedEntities.join(", ")}\n`);
  }

  for (const step of SEED_ORDER) {
    if (seedAll || requestedEntities.includes(step.flag)) {
      console.log(`[${step.label}]`);
      await step.fn();
      console.log();
    }
  }

  console.log("Done!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seeding error:", error);
  process.exit(1);
});
