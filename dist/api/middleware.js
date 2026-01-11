import { config } from "../config.js";
export function middlewareLogResponse(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(_, __, next) {
    config.fileserverHits++;
    next();
}
