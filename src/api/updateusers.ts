import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequest, Unauthorized } from "./errorhandler.js";
import { db } from "../db/index.js";
import { 
    getBearerToken,
    validateJWT,
    hashPassword
    } from "./auth.js";
import { users } from "../db/schema.js";
import { getUserInfo } from "../db/queries/users.js";
import { eq } from "drizzle-orm";
import { config } from "../config.js";
import { isValidEmail } from "../utils/validemail.js";

export async function handlerUpdateUser(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.secret);

    const email = req.body.email;
    const password = req.body.password;

    if (email == null 
        || password == null
        || isValidEmail(email) == false
        ) {
            throw new BadRequest("problem with new email or password");
        }
    const hashedPass = await hashPassword(password);
    const updateTime = new Date;
    await db
    .update(users)
    .set({
        updatedAt: updateTime,
        email: email,
        hashedPassword: hashedPass,
    })
    .where(eq(users.id, userId));

    const updatedUser = await getUserInfo(userId);
    respondWithJSON(res, 200, updatedUser)
}