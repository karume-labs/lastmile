/**
 * config/prisma.ts
 *
 * Single shared PrismaClient instance for the whole backend.
 *
 * Every module that touches the database should import `prisma` from here rather
 * than instantiating their own `new PrismaClient()` to prevent exhausting Postgres connections
 * and ensure same connection pool is used across the backend.
 */

import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const logLevels =
  env.NODE_ENV === 'development'
    ? (['warn', 'error'] as const)
    : (['error'] as const);

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: [...logLevels],
  });

if (env.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

/**
 * Call during graceful shutdown (e.g. in server.ts's SIGTERM handler)
 * so in-flight queries can finish and the connection pool closes cleanly.
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}