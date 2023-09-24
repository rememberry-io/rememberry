import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

export const users = pgTable("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  password: varchar("user_password").notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  has: many(stacks),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const topics = pgTable("topics", {
  topic_id: uuid("topic_id").defaultRandom().primaryKey(),
  topic: varchar("topic"),
});

export const topicsRelations = relations(topics, ({ many }) => ({
  has: many(stacks),
}));

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;

export const flashcards = pgTable("flashcards", {
  flashcard_id: uuid("flashcard_id").defaultRandom().primaryKey(),
  stack_id: uuid("stack_id").references(() => stacks.stack_id),
  frontside_text: varchar("frontside_text"),
  backside_text: varchar("backside_text"),
});

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  stacks: one(stacks, {
    fields: [flashcards.stack_id],
    references: [stacks.stack_id],
  }),
  frontside_media: many(frontside_media),
  backside_media: many(backside_media),
  tagsToCards: many(tagsToCards),
}));

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;

export const stacks = pgTable("stacks", {
  stack_id: uuid("stack_id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => users.user_id),
  stack_name: varchar("stack_name"),
  number_of_learned_cards: integer("number_of_learned_cards"),
  number_of_unlearned_cards: integer("number_of_unlearned_cards"),
  created_at: timestamp("created_at").defaultNow(),
  topic_id: uuid("topic_id").references(() => topics.topic_id),
});

export const stacksRelations = relations(stacks, ({ one, many }) => ({
  users: one(users, {
    fields: [stacks.user_id],
    references: [users.user_id],
  }),
  topics: one(topics, {
    fields: [stacks.topic_id],
    references: [topics.topic_id],
  }),
  flashcards: many(flashcards),
}));

export type Stack = typeof stacks.$inferSelect;
export type NewStack = typeof stacks.$inferInsert;

export const frontside_media = pgTable("frontside_media", {
  media_id: uuid("media_id").defaultRandom().primaryKey(),
  media_link: varchar("media_link"),
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id),
});

export const frontsideMediaRelations = relations(
  frontside_media,
  ({ one }) => ({
    flashcards: one(flashcards, {
      fields: [frontside_media.flashcard_id],
      references: [flashcards.flashcard_id],
    }),
  })
);

export type FrontsideMedia = typeof frontside_media.$inferSelect;
export type NewFrontsideMedia = typeof frontside_media.$inferInsert;

export const backside_media = pgTable("backside_media", {
  media_id: uuid("media_id").defaultRandom().primaryKey(),
  media_link: varchar("media_link"),
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id),
});

export const backsideMediaRelations = relations(backside_media, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [backside_media.flashcard_id],
    references: [flashcards.flashcard_id],
  }),
}));

export type BacksideMedia = typeof backside_media.$inferSelect;
export type NewBacksideMedia = typeof backside_media.$inferInsert;

export const tags = pgTable("tags", {
  tag_id: uuid("tag_id").primaryKey(),
  tag: varchar("tag"),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  tagsToCards: many(tagsToCards),
}));

export type Tags = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const tagsToCards = pgTable("tags_to_cards", {
  tag_id: uuid("tag_id")
    .notNull()
    .references(() => tags.tag_id),
  flashcard_id: uuid("flashcard_id")
    .notNull()
    .references(() => flashcards.flashcard_id),
});

export const tagsToCardsRelations = relations(tagsToCards, ({ one }) => ({
  tag: one(tags, {
    fields: [tagsToCards.tag_id],
    references: [tags.tag_id],
  }),
  flashcard: one(flashcards, {
    fields: [tagsToCards.flashcard_id],
    references: [flashcards.flashcard_id],
  }),
}));

export type TagToCard = typeof tagsToCards.$inferSelect;
export type newTagsToCard = typeof tagsToCards.$inferInsert;
