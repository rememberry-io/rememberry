ALTER TABLE "session_data" RENAME TO "learning_data";--> statement-breakpoint
ALTER TABLE "learning_data" DROP CONSTRAINT "session_data_flashcard_id_flashcards_id_fk";
--> statement-breakpoint
ALTER TABLE "learning_data" DROP CONSTRAINT "session_data_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_data" ADD CONSTRAINT "learning_data_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_data" ADD CONSTRAINT "learning_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
