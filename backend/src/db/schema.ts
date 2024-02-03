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
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
});

export const session = pgTable("user_session", {
  id: varchar("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userSessionRelation = relations(users, ({ many }) => ({
  maps: many(session),
}));

export const userRelations = relations(users, ({ many }) => ({
  maps: many(maps),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const maps = pgTable("maps", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  peerId: uuid("peer_id").references(() => Peers.id),
  name: varchar("name").notNull(),
  description: varchar("description").default("").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const mapRelations = relations(maps, ({ one, many }) => ({
  users: one(users, {
    fields: [maps.userId],
    references: [users.id],
  }),
  peers: one(Peers, {
    fields: [maps.peerId],
    references: [Peers.id],
  }),
  stacks: many(stacks),
}));

export type Map = typeof maps.$inferSelect;
export type newMap = typeof maps.$inferInsert;

export const stacks = pgTable("stacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  mapId: uuid("map_id").references(() => maps.id, { onDelete: "cascade" }),
  stack_name: varchar("stack_name"),
  stack_description: varchar("stack_description"),
  number_of_learned_cards: integer("number_of_learned_cards"),
  number_of_unlearned_cards: integer("number_of_unlearned_cards"),
  positioning: varchar("positioning"),
  parent_stack_id: uuid("parent_stack_id").references(
    (): AnyPgColumn => stacks.id,
  ),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const stacksRelations = relations(stacks, ({ one, many }) => ({
  maps: one(maps, {
    fields: [stacks.mapId],
    references: [maps.id],
  }),
  stacks: many(stacks),
  flashcards: many(flashcards),
}));

export type Stack = typeof stacks.$inferSelect;
export type NewStack = typeof stacks.$inferInsert;

export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  stackId: uuid("stack_id").references(() => stacks.id, {
    onDelete: "cascade",
  }),
  frontside_text: varchar("frontside_text"),
  backside_text: varchar("backside_text"),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  stacks: one(stacks, {
    fields: [flashcards.stackId],
    references: [stacks.id],
  }),
  Media: many(Media),
  session_data: many(session_data),
}));

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;

export const session_data = pgTable("session_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  flashcardId: uuid("flashcard_id").references(() => flashcards.id, {
    onDelete: "cascade",
  }),
  user_id: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  times_learned: integer("times_learned"),
  last_learned: date("last_learned"),
  learning_status: integer("learning_status").default(0),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const session_data_relations = relations(session_data, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [session_data.flashcardId],
    references: [flashcards.id],
  }),
  users: one(users, {
    fields: [session_data.user_id],
    references: [users.id],
  }),
}));

export type SessionData = typeof session_data.$inferSelect;
export type NewSessionData = typeof session_data.$inferInsert;

export const Media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  flashcardId: uuid("flashcard_id").references(() => flashcards.id, {
    onDelete: "cascade",
  }),
  frontside_media_link: varchar("frontside_media_link"),
  frontside_media_positioning: varchar("frontside_media_positioning"),
  backside_media_link: varchar("backside_media_link"),
  backside_media_positioning: varchar("backside_media_positioning"),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const media_relations = relations(Media, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [Media.flashcardId],
    references: [flashcards.id],
  }),
}));

export type Medias = typeof Media.$inferSelect;
export type NewMedia = typeof Media.$inferInsert;

export const Peers = pgTable("peers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const peers_relations = relations(Peers, ({ one, many }) => ({
  Users_Peers: many(Users_Peers),
  maps: many(maps),
  invites: many(invites),
}));

export type Peer = typeof Peers.$inferSelect;
export type NewPeer = typeof Peers.$inferInsert;

export const Users_Peers = pgTable("users_peers", {
  userId: uuid("user_id").references(() => users.id),
  peerId: uuid("peer_id").references(() => Peers.id),
  isPeerAdmin: boolean("is_peer_admin").default(false).notNull(),
});

export const users_peers_relations = relations(Users_Peers, ({ one }) => ({
  users: one(users, {
    fields: [Users_Peers.userId],
    references: [users.id],
  }),
  Peers: one(Peers, {
    fields: [Users_Peers.peerId],
    references: [Peers.id],
  }),
}));

export type UsersPeers = typeof Users_Peers.$inferSelect;
export type NewUsersPeers = typeof Users_Peers.$inferInsert;

export const invites = pgTable("invites", {
  invite_id: uuid("invite_id").defaultRandom(),
  receiver_id: uuid("reveiver_id").references(() => users.id),
  sender_id: uuid("sender_id").references(() => users.id),
  peer_id: uuid("peer_id").references(() => Peers.id),
  text: varchar("text"),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const invites_relations = relations(invites, ({ one }) => ({
  users: one(users),
  peers: one(Peers),
}));

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
