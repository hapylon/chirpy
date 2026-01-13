import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
// import { maxChirpLength } from "../api/chirp.js";
const maxChirpLength = 140;
export const users = pgTable("users", {
    id: uuid("id").unique().primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
});
export const chirps = pgTable("chirps", {
    id: uuid("id").unique().primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar("body", { length: maxChirpLength }).notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});
