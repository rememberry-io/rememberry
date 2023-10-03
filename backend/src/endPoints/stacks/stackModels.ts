import { client } from "../../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";


const database = drizzle(client, { schema });
type dbConnection = typeof database;


export async function getStacksFromMap(mapId:string, db:dbConnection){
  const prep = db.select().from(schema.stacks).where(eq(schema.stacks.map_id, sql.placeholder("id"))).prepare("stacks")
  const res = await prep.execute({id: mapId})
  return res 
}

export async function getStacksFromParent(parentStackId:string, db:dbConnection){
  const prep = db.select().from(schema.stacks).where(eq(schema.stacks.parent_stack_id, sql.placeholder("id"))).prepare("childStacks")
  const res = await prep.execute({id:parentStackId})
  return res 
}

export async function getParentFromStack(parentStackId:string, db:dbConnection){
  const prep = db.select().from(schema.stacks).where(eq(schema.stacks.stack_id, sql.placeholder("id"))).prepare("parentStack")
  const res = await prep.execute({id: parentStackId})
  return res 
}

export async function changeParentStack(newParentStack: schema.Stack, childStack: schema.Stack, db:dbConnection): Promise<schema.Stack[]>{
  const res = await db.update(schema.stacks).set({parent_stack_id:newParentStack.stack_id}).where(eq(schema.stacks.stack_id, childStack.stack_id)).returning()
  return res
}

export async function deleteParentStackRelation(childStack:schema.Stack, db:dbConnection): Promise<schema.Stack[]>{
  const res = await db.update(schema.stacks).set({parent_stack_id: null}).where(eq(schema.stacks.stack_id, childStack.stack_id)).returning()
  return res 
}

