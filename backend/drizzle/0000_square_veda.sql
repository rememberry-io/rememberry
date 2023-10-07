CREATE TABLE IF NOT EXISTS "backside_media" (
	"media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_link" varchar,
	"flashcard_id" uuid
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
	"media_link" varchar,
	"flashcard_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stacks" (
	"stack_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"stack_name" varchar,
	"number_of_learned_cards" integer,
	"number_of_unlearned_cards" integer,
	"created_at" timestamp DEFAULT now(),
	"topic_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"tag_id" uuid PRIMARY KEY NOT NULL,
	"tag" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_to_cards" (
	"tag_id" uuid NOT NULL,
	"flashcard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "topics" (
	"topic_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"user_password" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backside_media" ADD CONSTRAINT "backside_media_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_stack_id_stacks_stack_id_fk" FOREIGN KEY ("stack_id") REFERENCES "stacks"("stack_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frontside_media" ADD CONSTRAINT "frontside_media_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_topic_id_topics_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_to_cards" ADD CONSTRAINT "tags_to_cards_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_to_cards" ADD CONSTRAINT "tags_to_cards_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
