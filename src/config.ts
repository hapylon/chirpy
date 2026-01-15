import type { MigrationConfig } from "drizzle-orm/migrator";

type Config ={
    api: APIConfig;
    db: DBConfig;
    secret: string;
}

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    polkaKey: string;
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
process.loadEnvFile();


const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};



export const config: Config = {
    api: {
        fileserverHits: 0, 
        port: Number(envOrThrow("PORT")),
        platform: String(envOrThrow("PLATFORM")),
        polkaKey: String(envOrThrow("POLKA_KEY"))
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    secret: envOrThrow("JWTSECRET")
};
