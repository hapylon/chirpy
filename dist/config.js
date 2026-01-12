function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env var: ${key}`);
    }
    return value;
}
process.loadEnvFile();
export const config = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL")
};
