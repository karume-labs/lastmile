declare module "prisma/config" {
  export type PrismaConfig = {
    schema?: string;
    datasource?: {
      url: string;
      shadowDatabaseUrl?: string;
    };
  };

  export const defineConfig: <T extends PrismaConfig>(config: T) => T;
}