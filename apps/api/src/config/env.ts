const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6MEqDLd4pyCT@ep-plain-feather-atbxqjvt-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-2026',
} as const;

export const env = envConfig;
export type Env = typeof envConfig;