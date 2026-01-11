import { config } from "../config.js";
export function handlerReset(_, res) {
    config.fileserverHits = 0;
    res.send('Hits reset to zero');
}
