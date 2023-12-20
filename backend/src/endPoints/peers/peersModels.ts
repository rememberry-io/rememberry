import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";

const database = drizzle(client, { schema });

export async function createPeer(peerName: string): Promise<string> {
  const prep = database
    .insert(schema.Peers)
    .values({
      name: sql.placeholder("name"),
    })
    .returning()
    .prepare("createPeerQuery");
  const res = await prep.execute({ name: peerName });
  return res[0].peer_id;
}

export async function createUsersPeersRelation(peerId: string, userId: string) {
  const res = database
    .insert(schema.Users_Peers)
    .values({
      user_id: userId,
      peer_id: peerId,
    })
    .returning();
  return res;
}

export async function updatePeerName(newPeerName: string, peerId: string) {
  const res = database
    .update(schema.Peers)
    .set({ name: newPeerName })
    .returning();
  return res;
}

export async function checkIfMemberIsAdmin(
  userId: string,
  peerId: string,
): Promise<boolean> {
  const adminStatus = await database
    .select({ isAdmin: schema.Users_Peers.is_peer_admin })
    .from(schema.Users_Peers)
    .where(
      and(
        eq(schema.Users_Peers.user_id, userId),
        eq(schema.Users_Peers.peer_id, peerId),
      ),
    );
  return adminStatus[0].isAdmin;
}

export async function kickMember(kickedUserId: string, peerId: string) {
  const res = database
    .delete(schema.Users_Peers)
    .where(
      and(
        eq(schema.Users_Peers.user_id, kickedUserId),
        eq(schema.Users_Peers.peer_id, peerId),
      ),
    )
    .returning();
  return res;
}
