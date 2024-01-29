DROP TABLE "user_key";--> statement-breakpoint
ALTER TABLE "user_session" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user_session" ADD COLUMN "expires_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user_session" DROP COLUMN IF EXISTS "active_expires";--> statement-breakpoint
ALTER TABLE "user_session" DROP COLUMN IF EXISTS "idle_expires";