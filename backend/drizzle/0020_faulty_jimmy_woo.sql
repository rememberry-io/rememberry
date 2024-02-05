ALTER TABLE "flashcards" ALTER COLUMN "stack_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcards" ALTER COLUMN "frontside_text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcards" ALTER COLUMN "backside_text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcards" ADD COLUMN "x_position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcards" ADD COLUMN "y_position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "x_position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "y_position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "stacks" DROP COLUMN IF EXISTS "positioning";