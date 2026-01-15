import { Request, Response } from "express";
import { BadRequest, Forbidden, Unauthorized } from "./errorhandler.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { chirps } from "../db/schema.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { getOneChirp } from "./getonechirp.js";
import { respondWithJSON } from "./json.js";


export async function handlerDeleteChirps(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.secret);
    const chirpId = req.params.chirpID;
    const theChirp = await getOneChirp(chirpId);
    const chirpAuthorId = theChirp.userId;
    if (chirpAuthorId !== userId) {
        throw new Forbidden("Try that on your own chirps!");
    } else {
        await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId));
        respondWithJSON(res, 204, null);
    } 
}