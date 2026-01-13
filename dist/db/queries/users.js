import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    console.log("createUser arg:", user);
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
