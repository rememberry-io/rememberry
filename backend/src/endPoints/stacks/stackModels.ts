import { client } from "../../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { eq, and, desc, sql, isNull} from "drizzle-orm";


const database = drizzle(client, { schema });
type dbConnection = typeof database;



export async function createStack(stack:schema.NewStack, db:dbConnection): Promise<schema.NewStack[]>{
  const date = new Date()
  const res = await db.insert(schema.stacks).values({
    stack_id: stack.stack_id,
    stack_name: stack.stack_name,
    number_of_learned_cards: stack.number_of_learned_cards,
    number_of_unlearned_cards: stack.number_of_unlearned_cards,
    created_at: date,
    map_id: stack.map_id,
    stack_description: stack.stack_description,
    positioning: stack.positioning,
    parent_stack_id: stack.parent_stack_id
  }).returning()
  return res 
}

type ParentAndChildId = {
  child_id : string,
  new_parent_id : string
}

export async function getStacksFromMap(mapId:string, db:dbConnection){
  const prep = db.select().from(schema.stacks).where(eq(schema.stacks.map_id, sql.placeholder("id"))).prepare("stacks")
  const res = await prep.execute({id: mapId})
  return res 
}

export async function getHighestOrderParentStacks(mapId:string, db:dbConnection): Promise<schema.Stack[]>{
  const prep = db.select().from(schema.stacks).where(and(eq(schema.stacks.map_id, sql.placeholder("id"),), isNull(schema.stacks.parent_stack_id))).prepare("highestOrderStacks")
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

export async function changeParentStack(userInput:ParentAndChildId, db:dbConnection): Promise<schema.Stack[]>{
  const res = await db.update(schema.stacks).set({parent_stack_id:userInput.new_parent_id}).where(eq(schema.stacks.stack_id, userInput.child_id)).returning()
  return res
}

export async function deleteParentStackRelation(childStack:schema.Stack, db:dbConnection): Promise<schema.Stack[]>{
  const res = await db.update(schema.stacks).set({parent_stack_id: null}).where(eq(schema.stacks.stack_id, childStack.stack_id)).returning()
  return res 
}