ALTER TABLE "Media" ADD COLUMN "frontside_media_link" varchar;--> statement-breakpoint
ALTER TABLE "Media" ADD COLUMN "frontside_media_positioning" varchar;--> statement-breakpoint
ALTER TABLE "Media" ADD COLUMN "backside_media_link" varchar;--> statement-breakpoint
ALTER TABLE "Media" ADD COLUMN "backside_media_positioning" varchar;--> statement-breakpoint
ALTER TABLE "Media" DROP COLUMN IF EXISTS "test";--> statement-breakpoint
ALTER TABLE "Media" DROP COLUMN IF EXISTS "media_link";--> statement-breakpoint
ALTER TABLE "Media" DROP COLUMN IF EXISTS "positioning";