import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import * as schema from "../../db/schema";

const internalServerError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

export async function createPeer(peerName: string) {
  const prep = db
    .insert(schema.peers)
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
  const res = await db
    .insert(schema.usersPeers)
    .values({
      userId: userId,
      peerId: peerId,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function createAdminPeerrelation(peerId: string, userId: string) {
  const res = await db
    .insert(schema.usersPeers)
    .values({
      userId: userId,
      peerId: peerId,
      isPeerAdmin: true,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function updatePeerName(newPeerName: string, peerId: string) {
  const res = await db
    .update(schema.peers)
    .set({ name: newPeerName })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function getAdminStatus(userId: string, peerId: string) {
  try {
    const adminStatus = await db
      .select({ isAdmin: schema.usersPeers.isPeerAdmin })
      .from(schema.usersPeers)
      .where(
        and(
          eq(schema.usersPeers.userId, userId),
          eq(schema.usersPeers.peerId, peerId),
        ),
      );
    return [null, adminStatus[0].isAdmin] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function removeAdminStatus(userId: string, peerId: string) {
  const res = await db
    .update(schema.usersPeers)
    .set({ isPeerAdmin: false })
    .where(
      and(
        eq(schema.usersPeers.peerId, peerId),
        eq(schema.usersPeers.userId, userId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function addAdminStatus(userId: string, peerId: string) {
  const res = await db
    .update(schema.usersPeers)
    .set({ isPeerAdmin: true })
    .where(
      and(
        eq(schema.usersPeers.peerId, peerId),
        eq(schema.usersPeers.userId, userId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function kickMember(kickedUserId: string, peerId: string) {
  const res = await db
    .delete(schema.usersPeers)
    .where(
      and(
        eq(schema.usersPeers.userId, kickedUserId),
        eq(schema.usersPeers.peerId, peerId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}
