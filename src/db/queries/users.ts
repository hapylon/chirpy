import { db } from "../index.js";
import { NewUser, users, UserInfo } from "../schema.js";
import { eq, getTableColumns } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserInfo(userId: string): Promise<UserInfo> {
  const {hashedPassword, ...rest} = getTableColumns(users);
  const [user] = await db.select({...rest})
  .from(users)
  .where(eq(users.id, userId));
  return user;
}