import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";

const database = drizzle(client, { schema });
type dbConnection = typeof database;

export async function createMap(
  userInput: schema.newMap,
): Promise<schema.Map[]> {
  const res = await database
    .insert(schema.maps)
    .values({
      user_id: userInput.user_id,
      map_name: userInput.map_name,
      map_description: userInput.map_description,
    })
    .returning();
  return res;
}

export async function createSharedMap(map: schema.newMap): Promise<schema.newMap>{
  const res = await database 
    .insert(schema.maps)
    .values({
      user_id: map.user_id,
      peer_id: map.peer_id,
      map_name: map.map_name,
      map_description: map.map_description
    })
    .returning()
  
    return res[0]
}

export async function updateMap(
  userInput: schema.newMap,
): Promise<schema.Map[]> {
  const res = await database
    .update(schema.maps)
    .set({
      map_name: userInput.map_name,
      map_description: userInput.map_description,
    })
    .returning();

  return res;
}

export async function deleteMapWithAllStacks(
  mapId: string,
): Promise<schema.Map[]> {
  const res = database
    .delete(schema.maps)
    .where(eq(schema.maps.map_id, mapId))
    .returning();
  return res;
}

export async function getMapsByUserId(userId: string): Promise<schema.Map[]> {
  const prepared = database
    .select()
    .from(schema.maps)
    .where(eq(schema.maps.user_id, sql.placeholder("id")))
    .prepare("maps");
  const res = await prepared.execute({ id: userId });
  return res;
}
