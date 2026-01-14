import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { NewUser, CreatedUser } from "../db/schema.js";
import { BadRequest, NotFound } from "./errorhandler.js";
import { createCipheriv } from "node:crypto";
import { randomUUID } from "crypto";
import { hashPassword } from "./auth.js";


export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    }
    const params: parameters = req.body;
    if (params.email == null || params.email == "") {
        throw new BadRequest("email seems null");
    }
    if (params.password == null) {
        throw new BadRequest("password seems null");
    }
    if (isValidEmail(params.email)) {
        // console.log("body:", req.body);
        try {
            let hashPass = await hashPassword(params.password)
            let createdUser = await createUser({
                id: randomUUID(),
                email: params.email,
                hashedPassword: hashPass,
            });
            // console.log("user:", createdUser);
        if (createdUser == null) {
            throw new Error("failed to create user");
        } else {
            let payload = {
                "id": createdUser.id,
                "createdAt": createdUser.createdAt,
                "updatedAt": createdUser.updatedAt,
                "email": createdUser.email
            }
            respondWithJSON(res, 201, payload);
        }
    } catch (err) {
            console.error("Create user error:", err);
            throw err;
        }
    //     else {
    //     throw new BadRequest("valid email required");
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}