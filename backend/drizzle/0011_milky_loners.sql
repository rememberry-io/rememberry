ALTER TABLE "Media" RENAME TO "media";--> statement-breakpoint
ALTER TABLE "Peers" RENAME TO "peers";--> statement-breakpoint
ALTER TABLE "Users_Peers" DROP CONSTRAINT "Users_Peers_peer_id_Peers_peer_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_peer_id_Peers_peer_id_fk";
--> statement-breakpoint
ALTER TABLE "maps" DROP CONSTRAINT "maps_peer_id_Peers_peer_id_fk";
--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "Media_flashcard_id_flashcards_flashcard_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Users_Peers" ADD CONSTRAINT "Users_Peers_peer_id_peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_peer_id_peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_peer_id_peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_flashcard_id_flashcards_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("flashcard_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
