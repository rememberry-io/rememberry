CREATE TABLE IF NOT EXISTS "backside_media" (
	"media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flashcard_id" uuid,
	"media_link" varchar,
	"positioning" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flashcards" (
	"flashcard_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stack_id" uuid,
	"frontside_text" varchar,
	"backside_text" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "frontside_media" (
	"media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flashcard_id" uuid,
	"media_link" varchar,
	"positioning" varchar
);
--> statement-breakpoint
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
	"last_learned" date,
	"learning_status" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stacks" (
	"stack_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid,
	"stack_name" varchar,
	"stack_description" varchar,
	"number_of_learned_cards" integer,
	"number_of_unlearned_cards" integer,
	"created_at" timestamp DEFAULT now(),
	"positioning" varchar,
	"parent_stack_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"user_password" varchar NOT NULL,
	"refresh_token" varchar,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backside_media" ADD CONSTRAINT "backside_media_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_stack_id_stacks_stack_id_fk" FOREIGN KEY ("stack_id") REFERENCES "stacks"("stack_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frontside_media" ADD CONSTRAINT "frontside_media_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_data" ADD CONSTRAINT "session_data_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_map_id_maps_map_id_fk" FOREIGN KEY ("map_id") REFERENCES "maps"("map_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_parent_stack_id_stacks_stack_id_fk" FOREIGN KEY ("parent_stack_id") REFERENCES "stacks"("stack_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
