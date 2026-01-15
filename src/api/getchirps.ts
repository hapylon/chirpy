import { Request, Response } from "express";
import { asc, desc, eq } from "drizzle-orm";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequest, Unauthorized } from "./errorhandler.js";
import { db } from "../db/index.js";
import { chirps } from "../db/schema.js";

export async function handlerGetChirps(req: Request, res: Response) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
    }
    if (authorId.length > 0) {
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
            .where(eq(chirps.userId, authorId))
            .orderBy(asc(chirps.createdAt));
            if (req.query.sort == "desc") {
                const descDump = dump.reverse();
                respondWithJSON(res, 200, descDump);        
            } else {
                respondWithJSON(res, 200, dump);
            }
        } catch (err) {
            console.error();
        }
    } else {
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
            if (req.query.sort == "desc") {
                const descDump = dump.reverse();
                respondWithJSON(res, 200, descDump);        
            } else {
                respondWithJSON(res, 200, dump);
            }
        } catch (err) {
            console.error();
        }
    }
}
