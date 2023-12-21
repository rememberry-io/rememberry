CREATE TABLE IF NOT EXISTS "user_key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"hashed_password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "media_id" TO "id";--> statement-breakpoint
ALTER TABLE "peers" RENAME COLUMN "peer_id" TO "id";--> statement-breakpoint
ALTER TABLE "flashcards" RENAME COLUMN "flashcard_id" TO "id";--> statement-breakpoint
ALTER TABLE "maps" RENAME COLUMN "map_id" TO "id";--> statement-breakpoint
ALTER TABLE "session_data" RENAME COLUMN "session_id" TO "id";--> statement-breakpoint
ALTER TABLE "stacks" RENAME COLUMN "stack_id" TO "id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "user_id" TO "id";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_flashcard_id_flashcards_flashcard_id_fk";
--> statement-breakpoint
ALTER TABLE "users_peers" DROP CONSTRAINT "users_peers_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_peers" DROP CONSTRAINT "users_peers_peer_id_peers_peer_id_fk";
--> statement-breakpoint
ALTER TABLE "flashcards" DROP CONSTRAINT "flashcards_stack_id_stacks_stack_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_reveiver_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_sender_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_peer_id_peers_peer_id_fk";
--> statement-breakpoint
ALTER TABLE "maps" DROP CONSTRAINT "maps_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "maps" DROP CONSTRAINT "maps_peer_id_peers_peer_id_fk";
--> statement-breakpoint
ALTER TABLE "session_data" DROP CONSTRAINT "session_data_flashcard_id_flashcards_flashcard_id_fk";
--> statement-breakpoint
ALTER TABLE "session_data" DROP CONSTRAINT "session_data_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_map_id_maps_map_id_fk";
--> statement-breakpoint
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_parent_stack_id_stacks_stack_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_peers" ADD CONSTRAINT "users_peers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_peers" ADD CONSTRAINT "users_peers_peer_id_peers_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_stack_id_stacks_id_fk" FOREIGN KEY ("stack_id") REFERENCES "stacks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_reveiver_id_users_id_fk" FOREIGN KEY ("reveiver_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_peer_id_peers_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_peer_id_peers_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_data" ADD CONSTRAINT "session_data_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_data" ADD CONSTRAINT "session_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_parent_stack_id_stacks_id_fk" FOREIGN KEY ("parent_stack_id") REFERENCES "stacks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_key" ADD CONSTRAINT "user_key_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
