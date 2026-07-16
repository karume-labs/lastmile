import { createInterface } from "node:readline";
import { seedAuditLogs } from "@lastmile/db/audit/seed";
import { seedSuperAdmin } from "@lastmile/db/auth/seed";
import { seedStaff } from "@lastmile/db/auth/seed/staff";
import { seedClawbackLogs } from "@lastmile/db/clawback/seed";
import { db } from "@lastmile/db/client";
import { seedIdentities } from "@lastmile/db/identity/seed";
import { seedProgrammes } from "@lastmile/db/programmes/seed";
import { seedRegistrations } from "@lastmile/db/registration/seed";
import { env } from "@lastmile/db/seed/env";
import { seedSmsMessages } from "@lastmile/db/sms/seed";
import { sql } from "drizzle-orm";

const ENTITY_FLAGS = [
  "auth",
  "staff",
  "identity",
  "registration",
  "programmes",
  "sms",
  "audit",
  "clawback",
] as const;

type Entity = (typeof ENTITY_FLAGS)[number];

function printUsage() {
  console.log(
    `
Usage: bun run db:seed [options]

Options:
  --auth           Seed super admin user from ADMIN_EMAIL and ADMIN_PASSWORD
  --staff          Seed staff, admin, and field agent users
  --identity       Seed identities and proxies
  --registration   Seed registrations
  --programmes     Seed programmes, batches, and disbursements
  --sms            Seed SMS notifications
  --audit          Seed audit logs
  --clawback       Seed clawback logs
  --force, -f      Clear all data before seeding
  --help, -h       Show this help message

If no entity flags are specified, all connected entities are seeded.
`,
  );
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
    "clawback_logs",
    "audit_logs",
    "sms_messages",
    "disbursements",
    "batches",
    "programmes",
    "registrations",
    "proxies",
    "identities",
    "verification",
    "session",
    "account",
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
const SEED_ORDER: { flag: Entity; label: string; fn: () => Promise<void> }[] = [
  { flag: "auth", label: "Super Admin (Auth)", fn: seedSuperAdmin },
  { flag: "staff", label: "Staff & Field Agents (Auth)", fn: seedStaff },
  { flag: "identity", label: "Identities & Proxies", fn: seedIdentities },
  { flag: "registration", label: "Registrations", fn: seedRegistrations },
  { flag: "programmes", label: "Programmes & Disbursements", fn: seedProgrammes },
  { flag: "sms", label: "SMS Messages", fn: seedSmsMessages },
  { flag: "audit", label: "Audit Logs", fn: seedAuditLogs },
  { flag: "clawback", label: "Clawback Logs", fn: seedClawbackLogs },
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
