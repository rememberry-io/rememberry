ALTER TABLE "Users_Peers" RENAME TO "users_peers";--> statement-breakpoint
ALTER TABLE "users_peers" DROP CONSTRAINT "Users_Peers_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_peers" DROP CONSTRAINT "Users_Peers_peer_id_peers_peer_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_peers" ADD CONSTRAINT "users_peers_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_peers" ADD CONSTRAINT "users_peers_peer_id_peers_peer_id_fk" FOREIGN KEY ("peer_id") REFERENCES "peers"("peer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


CREATE OR REPLACE FUNCTION notify_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Construct the notification payload
  PERFORM pg_notify('stack_change', TG_OP || ',' || NEW.stack_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_stack_change
AFTER INSERT OR UPDATE OR DELETE ON stacks
FOR EACH ROW EXECUTE FUNCTION notify_change();


