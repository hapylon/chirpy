import { asc, eq } from "drizzle-orm";
import { respondWithJSON } from "./json.js";
import { NotFound } from "./errorhandler.js";
import { db } from "../db/index.js";
import { chirps } from "../db/schema.js";
export async function handlerGetOneChirp(req, res) {
    try {
        const chirpId = req.params.name;
        const [oneChirp] = await db
            .select({
            "id": chirps.id,
            "created_at": chirps.createdAt,
            "updated_at": chirps.updatedAt,
            "body": chirps.body,
            "userId": chirps.userId
        })
            .from(chirps)
            .where(eq(chirps.id, chirpId))
            .orderBy(asc(chirps.createdAt));
        respondWithJSON(res, 200, oneChirp);
    }
    catch (err) {
        console.error();
        throw new NotFound("We're not finding that_");
    }
}
