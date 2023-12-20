import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";

const database = drizzle(client, { schema });

const internalServerError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

export async function createPeer(peerName: string) {
  const prep = database
    .insert(schema.Peers)
    .values({
      name: sql.placeholder("name"),
    })
    .returning()
    .prepare("createPeerQuery");
  const res = await prep.execute({ name: peerName });
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }

  return [null, res[0]] as const;
}

export async function createUsersPeersRelation(peerId: string, userId: string) {
  const res = await database
    .insert(schema.Users_Peers)
    .values({
      user_id: userId,
      peer_id: peerId,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function createAdminPeerrelation(peerId: string, userId: string) {
  const res = await database
    .insert(schema.Users_Peers)
    .values({
      user_id: userId,
      peer_id: peerId,
      is_peer_admin: true,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function updatePeerName(newPeerName: string, peerId: string) {
  const res = await database
    .update(schema.Peers)
    .set({ name: newPeerName })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function getAdminStatus(userId: string, peerId: string) {
  try {
    const adminStatus = await database
      .select({ isAdmin: schema.Users_Peers.is_peer_admin })
      .from(schema.Users_Peers)
      .where(
        and(
          eq(schema.Users_Peers.user_id, userId),
          eq(schema.Users_Peers.peer_id, peerId),
        ),
      );
    return [null, adminStatus[0].isAdmin] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function removeAdminStatus(userId: string, peerId: string) {
  const res = await database
    .update(schema.Users_Peers)
    .set({ is_peer_admin: false })
    .where(
      and(
        eq(schema.Users_Peers.peer_id, peerId),
        eq(schema.Users_Peers.user_id, userId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function addAdminStatus(userId: string, peerId: string) {
  const res = await database
    .update(schema.Users_Peers)
    .set({ is_peer_admin: true })
    .where(
      and(
        eq(schema.Users_Peers.peer_id, peerId),
        eq(schema.Users_Peers.user_id, userId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function kickMember(kickedUserId: string, peerId: string) {
  const res = await database
    .delete(schema.Users_Peers)
    .where(
      and(
        eq(schema.Users_Peers.user_id, kickedUserId),
        eq(schema.Users_Peers.peer_id, peerId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}
