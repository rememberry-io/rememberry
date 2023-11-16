import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";
import { TRPCError } from "@trpc/server";
import { TRPCError } from "@trpc/server";

const database = drizzle(client, { schema });

const internalServerError = new TRPCError({code:"INTERNAL_SERVER_ERROR"})

const internalServerError = new TRPCError({code:"INTERNAL_SERVER_ERROR"})

export async function createMap(
  userInput: schema.newMap,
 ) {
 ) {
  const res = await database
    .insert(schema.maps)
    .values({
      user_id: userInput.user_id,
      map_name: userInput.map_name,
      map_description: userInput.map_description,
    })
    .returning();    
    if(res.length < 1){
    return [internalServerError, null] as const 
    }
  return [null, res[0]] as const;
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
){
){
  const res = await database
    .update(schema.maps)
    .set({
      map_name: userInput.map_name,
      map_description: userInput.map_description,
    })
    .returning();
    if(res.length < 1){
      return [internalServerError, null] as const
    }
  return [null, res] as const;
    if(res.length < 1){
      return [internalServerError, null] as const
    }
  return [null, res] as const;
}

export async function deleteMapWithAllStacks(
  mapId: string,
 ){
  const res = await database
 ){
  const res = await database
    .delete(schema.maps)
    .where(eq(schema.maps.map_id, mapId))
    .returning();
  if(res.length < 1){
    return [internalServerError, null] as const
  }
  return [null, res] as const
  if(res.length < 1){
    return [internalServerError, null] as const
  }
  return [null, res] as const
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

export async function getUsersMaps(userId:string){
  const res = await database.execute(sql`
  SELECT m.map_id, m.map_name, m.map_description
  FROM maps m
  WHERE m.user_id = 'your_user_id'
  UNION 
  SELECT m.map_id, m.map_name, m.map_description
  FROM maps m
  JOIN peers p ON m.peer_id = p.peer_id
  JOIN users_peers up ON p.peer_id = up.peer_id
  WHERE up.user_id = 'your_user_id';
`)
  return res.rows
}
