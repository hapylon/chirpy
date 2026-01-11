import { config } from "../config.js";
export function handlerMetrics(_, res) {
    res.send(`Hits: ${config.fileserverHits}`);
}
