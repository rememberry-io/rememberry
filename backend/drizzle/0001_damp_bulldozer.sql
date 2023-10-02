CREATE TABLE IF NOT EXISTS "maps" (
	"map_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"map_name" varchar,
	"map_description" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_data" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flashcard_id" uuid,
	"times_learned" integer,
	"last_learned" date
);
--> statement-breakpoint
DROP TABLE "tags";--> statement-breakpoint
DROP TABLE "tags_to_cards";--> statement-breakpoint
DROP TABLE "topics";--> statement-breakpoint
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_topic_id_topics_topic_id_fk";
--> statement-breakpoint
ALTER TABLE "backside_media" ADD COLUMN "positioning" varchar;--> statement-breakpoint
ALTER TABLE "frontside_media" ADD COLUMN "positioning" varchar;--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "map_id" uuid;--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "stack_description" varchar;--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "positioning" varchar;--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "parent_stack_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_map_id_maps_map_id_fk" FOREIGN KEY ("map_id") REFERENCES "maps"("map_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_parent_stack_id_stacks_stack_id_fk" FOREIGN KEY ("parent_stack_id") REFERENCES "stacks"("stack_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "stacks" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "stacks" DROP COLUMN IF EXISTS "topic_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_data" ADD CONSTRAINT "session_data_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");