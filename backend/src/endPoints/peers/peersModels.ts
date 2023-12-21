import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import * as schema from "../../db/schema";

const internalServerError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

export async function createPeer(peerName: string) {
  const prep = db
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
  const res = await db
    .insert(schema.Users_Peers)
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
    .insert(schema.Users_Peers)
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
    const adminStatus = await db
      .select({ isAdmin: schema.Users_Peers.isPeerAdmin })
      .from(schema.Users_Peers)
      .where(
        and(
          eq(schema.Users_Peers.userId, userId),
          eq(schema.Users_Peers.peerId, peerId),
        ),
      );
    return [null, adminStatus[0].isAdmin] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function removeAdminStatus(userId: string, peerId: string) {
  const res = await db
    .update(schema.Users_Peers)
    .set({ isPeerAdmin: false })
    .where(
      and(
        eq(schema.Users_Peers.peerId, peerId),
        eq(schema.Users_Peers.userId, userId),
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
    .update(schema.Users_Peers)
    .set({ isPeerAdmin: true })
    .where(
      and(
        eq(schema.Users_Peers.peerId, peerId),
        eq(schema.Users_Peers.userId, userId),
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
    .delete(schema.Users_Peers)
    .where(
      and(
        eq(schema.Users_Peers.userId, kickedUserId),
        eq(schema.Users_Peers.peerId, peerId),
      ),
    )
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}
