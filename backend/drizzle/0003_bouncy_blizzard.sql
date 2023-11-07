CREATE TABLE IF NOT EXISTS "Media" (
	"media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flashcard_id" uuid,
	"media_link" varchar,
	"positioning" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Peers" (
	"peer_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users_Peers" (
	"user_id" uuid,
	"peer_id" uuid,
	"is_peer_admin" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"invite_id" uuid DEFAULT gen_random_uuid(),
	"reveiver_id" uuid,
	"sender_id" uuid,
	"peer_id" uuid,
	"text" varchar
);
--> statement-breakpoint
DROP TABLE "backside_media";--> statement-breakpoint
DROP TABLE "frontside_media";--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN "peer_id" uuid;--> statement-breakpoint
ALTER TABLE "session_data" ADD COLUMN "user_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_peer_id_Peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "Peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_data" ADD CONSTRAINT "session_data_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Media" ADD CONSTRAINT "Media_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Users_Peers" ADD CONSTRAINT "Users_Peers_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Users_Peers" ADD CONSTRAINT "Users_Peers_peer_id_Peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "Peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_reveiver_id_users_user_id_fk" FOREIGN KEY ("reveiver_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_sender_id_users_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_peer_id_Peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "Peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
