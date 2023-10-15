import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  uuid,
  timestamp,
  AnyPgColumn,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("user_password").notNull(),
  refresh_token: varchar("refresh_token"),
});

export const userRelations = relations(users, ({ many }) => ({
  maps: many(maps),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const maps = pgTable("maps", {
  map_id: uuid("map_id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => users.user_id, {
    onDelete: "cascade",
  }),
  map_name: varchar("map_name"),
  map_description: varchar("map_description"),
});

export const mapRelations = relations(maps, ({ one, many }) => ({
  users: one(users, {
    fields: [maps.user_id],
    references: [users.user_id],
  }),
  stacks: many(stacks),
}));

export type Map = typeof maps.$inferSelect;
export type newMap = typeof maps.$inferInsert;

export const stacks = pgTable("stacks", {
  stack_id: uuid("stack_id").defaultRandom().primaryKey(),
  map_id: uuid("map_id").references(() => maps.map_id, { onDelete: "cascade" }),
  stack_name: varchar("stack_name"),
  stack_description: varchar("stack_description"),
  number_of_learned_cards: integer("number_of_learned_cards"),
  number_of_unlearned_cards: integer("number_of_unlearned_cards"),
  created_at: timestamp("created_at").defaultNow(),
  positioning: varchar("positioning"),
  parent_stack_id: uuid("parent_stack_id").references(
    (): AnyPgColumn => stacks.stack_id
  ),
});

export const stacksRelations = relations(stacks, ({ one, many }) => ({
  maps: one(maps, {
    fields: [stacks.map_id],
    references: [maps.map_id],
  }),
  stacks: many(stacks),
  flashcards: many(flashcards),
}));

export type Stack = typeof stacks.$inferSelect;
export type NewStack = typeof stacks.$inferInsert;

export const flashcards = pgTable("flashcards", {
  flashcard_id: uuid("flashcard_id").defaultRandom().primaryKey(),
  stack_id: uuid("stack_id").references(() => stacks.stack_id, {
    onDelete: "cascade",
  }),
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
  session_data: many(session_data),
}));

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;

export const session_data = pgTable("session_data", {
  session_id: uuid("session_id").defaultRandom().primaryKey(),
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id, {
    onDelete: "cascade",
  }),
  times_learned: integer("times_learned"),
  last_learned: date("last_learned"),
  learning_status: integer("learning_status").default(0),
});

export const session_data_relations = relations(session_data, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [session_data.flashcard_id],
    references: [flashcards.flashcard_id],
  }),
}));

export type SessionData = typeof session_data.$inferSelect;
export type NewSessionData = typeof session_data.$inferInsert;

export const frontside_media = pgTable("frontside_media", {
  media_id: uuid("media_id").defaultRandom().primaryKey(),
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id, {
    onDelete: "cascade",
  }),
  media_link: varchar("media_link"),
  positioning: varchar("positioning"),
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
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id, {
    onDelete: "cascade",
  }),
  media_link: varchar("media_link"),
  positioning: varchar("positioning"),
});

export const backsideMediaRelations = relations(backside_media, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [backside_media.flashcard_id],
    references: [flashcards.flashcard_id],
  }),
}));

export type BacksideMedia = typeof backside_media.$inferSelect;
export type NewBacksideMedia = typeof backside_media.$inferInsert;
