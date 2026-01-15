import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequest, Unauthorized } from "./errorhandler.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { getUserInfo } from "../db/queries/users.js";
import { eq } from "drizzle-orm";
import { config } from "../config.js";
import { getAPIKey } from "./auth.js";

export async function handlerWebhooks(req: Request, res: Response) {
    const ApiKey = getAPIKey(req);
    const polka = config.api.polkaKey;
    if (ApiKey != polka) {
        res.status(401).send();
        return;
    }
    const hookEvent = req.body.event;
    const hookUserId = req.body.data.userId;
    if (!hookEvent) {
        throw new BadRequest("no event specified")
    } else if (hookEvent != "user.upgraded") {
        respondWithJSON(res, 204, null);
        return;
    } else if (!hookUserId
        || typeof hookUserId !== "string"
        || hookUserId == null) { 
            respondWithError(res, 400, "event but no userId");
            return;
    } else {
        const user = await getUserInfo(hookUserId);
        if (!user 
            || user == null
            || user.id == null) {
            respondWithError(res, 404, "User not found");
            return;
        } else {
            const updateTime = new Date();
            await db
            .update(users)
            .set({
                updatedAt: updateTime,
                isChirpyRed: true,
            })
            .where(eq(users.id, hookUserId));
            respondWithJSON(res, 204, "");
        }
    }
}