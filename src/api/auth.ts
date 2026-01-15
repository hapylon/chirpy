import argon2 from "argon2";
import { Request, Response } from "express";
import jwt, { verify, JwtPayload } from "jsonwebtoken";
import { BadRequest, Unauthorized } from "./errorhandler.js";
import { randomBytes } from "crypto";
import { db } from "../db/index.js";
import { refresh_tokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

export async function hashPassword(password: string): Promise<string> {
    // const argon2 = require('argon2');
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.error();
        throw new Error;
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
        return true;
        } else {
            throw new Unauthorized("Incorrect email or password");
        }
     } catch (err) {
        console.error();
        throw new Unauthorized("Incorrect email or password");
    }
}

export type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: (Math.floor(Date.now() / 1000)) + expiresIn,
    }
    try {
        const token = jwt.sign(payload, secret);
        return token;
    } catch (err) {
        console.error("Error generating JWT", err);
        throw new Error;
    }
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const payload = jwt.verify(tokenString, secret);
        if (typeof payload.sub !== "string") {
            throw new Error("problem with validating payload")
        }
        return payload.sub;
    } catch (err) {
        // console.error("problem with token", err);
        throw new Unauthorized("seems the token was bad")
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        return token;
    } else {
        throw new Unauthorized("Bearer token not found");
    }
}

export async function makeRefreshToken(userId: string) {
    const buf = randomBytes(256);
    const token = buf.toString('hex');
    const refreshToken = await db.insert(refresh_tokens)
    .values({
        token,
        userId,
    })
    .returning();
    return refreshToken[0].token;
}

export async function handlerRefresh(req: Request, res: Response) {
    const refresh_token = getBearerToken(req);
    const currentDate = new Date();
    const [lookup] = await db.select()
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token, refresh_token));
    if (
        lookup.token == null
        || lookup.expiresAt < currentDate
        || lookup.revokedAt !== null
    ) {
        throw new Unauthorized("token expired or nonexistent");
    } else {
        const userID = await getUserFromRefreshToken(refresh_token);
        const newJWT = makeJWT(userID, 3600, config.secret);
        respondWithJSON(res, 200, { "token": `${newJWT}`})
    }
}

export async function getUserFromRefreshToken(token: string): Promise<string> {
    const [lookup] = await db
    .select({id: refresh_tokens.userId, token: refresh_tokens.token})
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token, token));
    return lookup.id;
}

export async function handlerRevoke(req: Request, res: Response) {
    const token = getBearerToken(req);
    const revocationTime = new Date();
    await db
    .update(refresh_tokens)
    .set({
        updatedAt: revocationTime,
        revokedAt: revocationTime,
    })
    .where(eq(refresh_tokens.token, token));
    respondWithJSON(res, 204, null);
}

export function getAPIKey(req: Request) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith("ApiKey ")) {
        const key = authHeader.split(" ")[1];
        return key;
    } else {
        throw new Unauthorized("API key not found");
    }
}