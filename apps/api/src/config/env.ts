export const env = {
  DATABASE_URL: process.env.DATABASE_URL,

  NODE_ENV: (process.env.NODE_ENV ?? 'development') as
    | 'development'
    | 'test'
    | 'production',

  SDP_CLIENT_MODE: (process.env.SDP_CLIENT_MODE ?? 'mock') as
    | 'mock'
    | 'http',
} as const;

