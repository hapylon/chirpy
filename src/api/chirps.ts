import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequest, Unauthorized } from "./errorhandler.js";
import { db } from "../db/index.js";
import { chirps } from "../db/schema.js";
import {randomUUID } from "crypto";

export const maxChirpLength = 140;

export async function handlerChirps(req: Request, res: Response) {
    const body = req.body.body;
    const userId = req.body.userId;
    if (!userId 
        || typeof body !== "string" 
        || body.length === 0
        || typeof userId !== "string") {
        throw new BadRequest("valid userId and chirp required");
    }
    
    if (body.length > maxChirpLength) {
        throw new BadRequest(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const cleanedBody = censor(body, badWords);
    const newRandom = randomUUID();

    const [newRow] = await db.insert(chirps)
    .values({id: newRandom, body: cleanedBody, userId: userId})
    .returning({
        "id": chirps.id,
        "createdAt": chirps.createdAt,
        "updatedAt": chirps.updatedAt,
        "body": chirps.body,
        "userId": chirps.userId
    })
    respondWithJSON(res, 201, newRow);
} 

export function censor(body: string, badwords: string[]) {
    let lowWords = body.toLowerCase().split(" ");
    let clean = body.split(" ");
    for (let i=0; i< badwords.length; i++) {
        while (lowWords.includes(badwords[i])) {
            let index = lowWords.indexOf(badwords[i]);
            if (index != -1) {
                lowWords.splice(index, 1, "****");
                clean.splice(index, 1, "****");
            } 
        }
    }
    const cleaned = clean.join(" ");
    return cleaned;
}

    
