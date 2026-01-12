import { respondWithJSON } from "./json.js";
import { BadRequest } from "./errorhandler.js";
export async function handlerValidate(req, res) {
    const params = req.body;
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const cleanedBody = censor(params.body, badWords);
    respondWithJSON(res, 200, { "cleanedBody": cleanedBody });
}
export function censor(body, badwords) {
    let lowWords = body.toLowerCase().split(" ");
    let clean = body.split(" ");
    for (let i = 0; i < badwords.length; i++) {
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
// res.header("Content-Type", "application/json");
//     if (typeof body.body !== "string") {
//         respondWithError(res, 400, "Problem with req.body.body");
//         return;
//     }
//     try {
//         if (req.body.body.length > 140) {
//             respondWithError(res, 400, "Chirp is too long");
//         }
//         else {
//             respondWithJSON(res, 200, {"valid": true});
//         }
//     } catch (error) {
//         console.log(error);
//         respondWithError(res, 400, "Something went wrong");
//     }
// }
// // if (typeof req.body.body !== "string") {
//         //     const rbody = JSON.stringify({"error": "invalid JSON req"});
//         //     res.status(400).send(rbody);
//         // }
// type responseData = {
//         createdAt: string;
//         ID: number;
//     };
//     let body = "";
