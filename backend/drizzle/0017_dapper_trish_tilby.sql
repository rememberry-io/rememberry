ALTER TABLE "maps" RENAME COLUMN "map_name" TO "name";--> statement-breakpoint
ALTER TABLE "maps" RENAME COLUMN "map_description" TO "description";--> statement-breakpoint
ALTER TABLE "maps" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "maps" ALTER COLUMN "description" SET NOT NULL;