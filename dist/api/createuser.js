import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequest } from "./errorhandler.js";
import { randomUUID } from "crypto";
import { hashPassword } from "./auth.js";
import { isValidEmail } from "../utils/validemail.js";
export async function handlerCreateUser(req, res) {
    const params = req.body;
    if (params.email == null || params.email == "") {
        throw new BadRequest("email seems null");
    }
    if (params.password == null) {
        throw new BadRequest("password seems null");
    }
    if (isValidEmail(params.email)) {
        // console.log("body:", req.body);
        try {
            let hashPass = await hashPassword(params.password);
            let createdUser = await createUser({
                id: randomUUID(),
                email: params.email,
                hashedPassword: hashPass,
            });
            // console.log("user:", createdUser);
            if (createdUser == null) {
                throw new Error("failed to create user");
            }
            else {
                let payload = {
                    "id": createdUser.id,
                    "createdAt": createdUser.createdAt,
                    "updatedAt": createdUser.updatedAt,
                    "email": createdUser.email,
                    "isChirpyRed": createdUser.isChirpyRed
                };
                respondWithJSON(res, 201, payload);
            }
        }
        catch (err) {
            console.error("Create user error:", err);
            throw err;
        }
        //     else {
        //     throw new BadRequest("valid email required");
    }
}
