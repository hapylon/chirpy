import { NotFound, Unauthorized } from "./errorhandler.js";
import { checkPasswordHash, makeRefreshToken } from "./auth.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { respondWithJSON } from "./json.js";
import { getUserInfo } from "../db/queries/users.js";
import { config } from "../config.js";
import { makeJWT } from "./auth.js";
export async function handlerLogin(req, res) {
    let expireClock = 3600;
    const params = req.body;
    if (params.email == null || params.email == "") {
        throw new Unauthorized("email seems null");
    }
    if (params.password == null) {
        throw new Unauthorized("password seems null");
    }
    const userID = await emailToUserId(params.email);
    const userHash = await userIdToPasswordHash(userID);
    if (await checkPasswordHash(params.password, userHash) == true) {
        let userInfo = await getUserInfo(userID);
        let token = makeJWT(userID, expireClock, config.secret);
        let refreshToken = await makeRefreshToken(userID);
        let userInfoWithTokens = { ...userInfo, token, refreshToken };
        respondWithJSON(res, 200, userInfoWithTokens);
    }
    else {
        throw new Unauthorized("Incorrect email or password");
    }
}
export async function emailToUserId(email) {
    const [user] = await db
        .select({ id: users.id, email: users.email })
        .from(users)
        .where(eq(users.email, email));
    if (user == null || user.id == null) {
        throw new NotFound("Incorrect email or password");
    }
    else {
        return user.id;
    }
}
export async function userIdToPasswordHash(userId) {
    const [user] = await db
        .select({ id: users.id, hashedPassword: users.hashedPassword })
        .from(users)
        .where(eq(users.id, userId));
    if (!user || user.id == null || !user.hashedPassword) {
        throw new Unauthorized("Incorrect email or password");
    }
    else {
        return user.hashedPassword;
    }
}
