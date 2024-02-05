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
  mapId: uuid("map_id")
    .references(() => maps.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("stack_name").notNull(),
  description: varchar("stack_description").notNull(),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  parentStackId: uuid("parent_stack_id").references(
    (): AnyPgColumn => stacks.id,
  ),
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
  stackId: uuid("stack_id")
    .references(() => stacks.id, {
      onDelete: "cascade",
    })
    .notNull(),
  frontside: varchar("frontside_text").notNull(),
  backside: varchar("backside_text").notNull(),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
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

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  stacks: one(stacks, {
    fields: [flashcards.stackId],
    references: [stacks.id],
  }),
  Media: many(media),
  session_data: many(learningData),
}));

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;

export const learningData = pgTable("learning_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  flashcardId: uuid("flashcard_id").references(() => flashcards.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  timesLearned: integer("times_learned"),
  lastLearned: date("last_learned"),
  learningStatus: integer("learning_status").default(0),
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

export const session_data_relations = relations(learningData, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [learningData.flashcardId],
    references: [flashcards.id],
  }),
  users: one(users, {
    fields: [learningData.userId],
    references: [users.id],
  }),
}));

export type LearningData = typeof learningData.$inferSelect;
export type NewLearningData = typeof learningData.$inferInsert;

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  flashcardId: uuid("flashcard_id").references(() => flashcards.id, {
    onDelete: "cascade",
  }),
  frontsideMediaLink: varchar("frontside_media_link"),
  frontsideMediaPositioning: varchar("frontside_media_positioning"),
  backsideMediaLink: varchar("backside_media_link"),
  backsideMediaPositioning: varchar("backside_media_positioning"),
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

export const media_relations = relations(media, ({ one }) => ({
  flashcards: one(flashcards, {
    fields: [media.flashcardId],
    references: [flashcards.id],
  }),
}));

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

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
