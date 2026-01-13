import { config } from "../config.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { Forbidden } from "../api/errorhandler.js";
export async function handlerReset(_, res) {
    if (config.api.platform == "dev") {
        config.api.fileserverHits = 0;
        try {
            await db.delete(users);
            res.send('users and hits reset');
        }
        catch (err) {
            throw new Error("database error");
        }
    }
    else {
        throw new Forbidden("unauthorized access denied");
    }
}
