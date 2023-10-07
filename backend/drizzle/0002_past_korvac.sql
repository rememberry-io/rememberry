ALTER TABLE "backside_media" DROP CONSTRAINT "backside_media_flashcard_id_flashcards_flashcard_id_fk";
--> statement-breakpoint
ALTER TABLE "flashcards" DROP CONSTRAINT "flashcards_stack_id_stacks_stack_id_fk";
--> statement-breakpoint
ALTER TABLE "frontside_media" DROP CONSTRAINT "frontside_media_flashcard_id_flashcards_flashcard_id_fk";
--> statement-breakpoint
ALTER TABLE "maps" DROP CONSTRAINT "maps_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session_data" DROP CONSTRAINT "session_data_flashcard_id_flashcards_flashcard_id_fk";
--> statement-breakpoint
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_map_id_maps_map_id_fk";
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
