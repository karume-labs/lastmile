export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:yourpassword@localhost:5432/lastmile?schema=public',
} as const;