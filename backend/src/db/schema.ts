
import { integer, pgTable, varchar, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const users = pgTable('users', {
    user_id: uuid('user_id').defaultRandom().primaryKey(),
    username: varchar('username').unique().notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull()
})
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert



export const topics = pgTable("topics", {
    topic_id: uuid('topic_id').primaryKey(),
    topic: varchar("topic")
})
export type Topic = typeof topics.$inferSelect
export type NewTopic = typeof topics.$inferInsert



export const stacks = pgTable("stacks", {
    stack_id: uuid('stack_id').defaultRandom().primaryKey(),
    user_id: uuid("user_id").references(()=>users.user_id),
    stack_name: varchar('stack_name'),
    number_of_learned_cards: integer('number_of_learned_cards'),
    number_of_unlearned_cards: integer('number_of_unlearned_cards'),
    created_at: timestamp("created_at").defaultNow(),
    topic_id: uuid('topic_id').references(() => topics.topic_id)
}
)
export type Stack = typeof stacks.$inferSelect
export type NewStack = typeof stacks.$inferInsert



export const flashcards = pgTable("flashcards", {
    flashcard_id: uuid("flashcard_id").defaultRandom().primaryKey(),
    stack_id: uuid("stack_id").references(()=>stacks.stack_id),
    frontside_text: varchar("frontside_text"),
    backside_text: varchar("backside_text")
}, (table) => {
    return {
        flashcard_idx: index("flashcard_idx").on(table.flashcard_id)
    }
}
)
export type Flashcard = typeof flashcards.$inferSelect
export type NewFlashcard = typeof flashcards.$inferInsert



export const frontside_media = pgTable("frontside_media", {
    media_id: uuid("media_id").defaultRandom().primaryKey(),
    meida_link: varchar("media_link"),
    flashcard_id: uuid("flashcard_id").references(()=>flashcards.flashcard_id)
})
export type FrontsideMedia = typeof frontside_media.$inferSelect
export type NewFrontsideMedia = typeof frontside_media.$inferInsert



export const backside_media = pgTable("frontside_media", {
    media_id: uuid("media_id").defaultRandom().primaryKey(),
    meida_link: varchar("media_link"),
    flashcard_id: uuid("flashcard_id").references(()=>flashcards.flashcard_id)
})
export type BacksideMedia = typeof backside_media.$inferSelect
export type NewBacksideMedia = typeof backside_media.$inferInsert