import { Request, Response } from "express";
import { asc, desc } from "drizzle-orm";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequest, Unauthorized } from "./errorhandler.js";
import { db } from "../db/index.js";
import { chirps } from "../db/schema.js";

export async function handlerGetChirps(req: Request, res: Response) {
    try {
        const dump = await db
        .select({
            "id": chirps.id, 
            "created_at": chirps.createdAt,
            "updated_at": chirps.updatedAt,
            "body": chirps.body,
            "userId": chirps.userId
        })
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
        respondWithJSON(res, 200, dump);
    } catch (err) {
        console.error();
    }
}
