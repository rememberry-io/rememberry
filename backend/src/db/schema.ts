import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  date,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey().notNull(),
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
  peer_id: uuid("peer_id").references(()=> Peers.peer_id),
  map_name: varchar("map_name"),
  map_description: varchar("map_description"),
});

export const mapRelations = relations(maps, ({ one, many }) => ({
  users: one(users, {
    fields: [maps.user_id],
    references: [users.user_id],
  }),
  peers: one(Peers, {
    fields: [maps.peer_id],
    references: [Peers.peer_id]
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
    (): AnyPgColumn => stacks.stack_id,
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
  Media: many(Media),
  session_data: many(session_data),
}));

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;

export const session_data = pgTable("session_data", {
  session_id: uuid("session_id").defaultRandom().primaryKey(),
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id, {
    onDelete: "cascade",
  }),
  user_id: uuid("user_id").references(()=> users.user_id, {onDelete: "cascade"}),
  times_learned: integer("times_learned"),
  last_learned: date("last_learned"),
  learning_status: integer("learning_status").default(0),
});

export const session_data_relations = relations(session_data, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [session_data.flashcard_id],
    references: [flashcards.flashcard_id],
  }),
  users: one(users, {
    fields: [session_data.user_id],
    references: [users.user_id]
  })
}));

export type SessionData = typeof session_data.$inferSelect;
export type NewSessionData = typeof session_data.$inferInsert;



export const Media = pgTable("Media", {
  media_id: uuid("media_id").defaultRandom().primaryKey(),
  flashcard_id: uuid("flashcard_id").references(() => flashcards.flashcard_id, {
    onDelete: "cascade",
  }),
  frontside_media_link: varchar("frontside_media_link"),
  frontside_media_positioning: varchar("frontside_media_positioning"),
  backside_media_link: varchar("backside_media_link"),
  backside_media_positioning: varchar("backside_media_positioning"),

});

export const media_relations = relations(Media, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [Media.flashcard_id],
    references: [flashcards.flashcard_id],
  }),
}));

export type Medias = typeof Media.$inferSelect;
export type NewMedia = typeof Media.$inferInsert;


export const Peers = pgTable("Peers", {
  peer_id: uuid("peer_id").defaultRandom().primaryKey(),
  name: varchar("name").notNull()
})

export const peers_relations = relations(Peers, ({ one, many }) => ({
  Users_Peers: many(Users_Peers),
  maps: many(maps),
  invites: many(invites)
}))

export const Peer = typeof Peers.$inferSelect
export const NewPeer = typeof Peers.$inferInsert

export const Users_Peers = pgTable("Users_Peers", {
  user_id: uuid("user_id").references(() => users.user_id),
  peer_id: uuid("peer_id").references(() => Peers.peer_id),
  is_peer_admin: boolean("is_peer_admin").default(false).notNull()
})

export const users_peers_relations = relations(Users_Peers, ({ one }) => ({
  users: one(users, {
    fields: [Users_Peers.user_id],
    references: [users.user_id]
  }),
  Peers: one(Peers, {
    fields: [Users_Peers.peer_id],
    references: [Peers.peer_id]
  })
}))

export type UsersPeers = typeof Users_Peers.$inferSelect
export type NewUsersPeers = typeof Users_Peers.$inferInsert


export const invites = pgTable("invites", {
  invite_id: uuid("invite_id").defaultRandom(),
  receiver_id: uuid("reveiver_id").references(() => users.user_id),
  sender_id: uuid("sender_id").references(()=>users.user_id),
  peer_id: uuid("peer_id").references(()=>Peers.peer_id),
  text: varchar("text")
})

export const invites_relations = relations(invites, ({ one }) => ({
  users: one(users),
  peers: one(Peers) 
}))

export type Invite = typeof invites.$inferSelect
export type NewInvite = typeof invites.$inferInsert