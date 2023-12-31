import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import * as schema from "../../db/schema";

const internalServerError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

export async function createMap(userInput: schema.newMap) {
  const res = await db
    .insert(schema.maps)
    .values({
      userId: userInput.userId,
      map_name: userInput.map_name,
      map_description: userInput.map_description,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }

  return [null, res[0]] as const;
}

export async function createSharedMap(
  map: schema.newMap,
): Promise<schema.newMap> {
  const res = await db
    .insert(schema.maps)
    .values({
      userId: map.userId,
      peer_id: map.peer_id,
      map_name: map.map_name,
      map_description: map.map_description,
    })
    .returning();

  return res[0];
}

export async function updateMap(userInput: schema.newMap) {
  const res = await db
    .update(schema.maps)
    .set({
      map_name: userInput.map_name,
      map_description: userInput.map_description,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res] as const;
}

export async function deleteMapWithAllStacks(mapId: string) {
  const res = await db
    .delete(schema.maps)
    .where(eq(schema.maps.id, mapId))
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res] as const;
}

export async function getMapsByUserId(userId: string): Promise<schema.Map[]> {
  const prepared = db
    .select()
    .from(schema.maps)
    .where(eq(schema.maps.userId, sql.placeholder("id")))
    .prepare("maps");
  const res = await prepared.execute({ id: userId });
  return res;
}

export async function getUsersMaps(userId: string) {
  const res = await db.execute(sql`
  SELECT m.id, m.map_name, m.map_description
  FROM maps m
  WHERE m.userId = 'your_user_id'
  UNION 
  SELECT m.id, m.map_name, m.map_description
  FROM maps m
  JOIN peers p ON m.peerId = p.peerId
  JOIN users_peers up ON p.peerId = up.peerId
  WHERE up.userId = 'your_user_id';
`);
  return res.rows;
}
