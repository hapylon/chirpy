function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env var: ${key}`);
    }
    return value;
}
process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: String(envOrThrow("PLATFORM"))
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    secret: envOrThrow("JWTSECRET")
};
