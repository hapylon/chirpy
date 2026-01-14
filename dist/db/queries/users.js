import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getUserInfo(userId) {
    const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));
    return user;
}
