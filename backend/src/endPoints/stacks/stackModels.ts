import { client } from "../../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { eq, and, desc, sql, isNull } from "drizzle-orm";
import * as types from "./types";

const database = drizzle(client, { schema });
type dbConnection = typeof database;

export async function createStack(
  stack: schema.NewStack,
  date: Date,
  db: dbConnection
): Promise<schema.NewStack[]> {
  const res = await db
    .insert(schema.stacks)
    .values({
      stack_id: stack.stack_id,
      stack_name: stack.stack_name,
      number_of_learned_cards: stack.number_of_learned_cards,
      number_of_unlearned_cards: stack.number_of_unlearned_cards,
      created_at: date,
      map_id: stack.map_id,
      stack_description: stack.stack_description,
      positioning: stack.positioning,
      parent_stack_id: stack.parent_stack_id,
    })
    .returning();
  return res;
}

export async function getStacksFromMap(mapId: string, db: dbConnection) {
  const prep = db
    .select()
    .from(schema.stacks)
    .where(eq(schema.stacks.map_id, sql.placeholder("id")))
    .prepare("stacks");
  const res = await prep.execute({ id: mapId });
  return res;
}

export async function getHighestOrderParentStacks(
  mapId: string,
  db: dbConnection
): Promise<schema.Stack[]> {
  const prep = db
    .select()
    .from(schema.stacks)
    .where(
      and(
        eq(schema.stacks.map_id, sql.placeholder("id")),
        isNull(schema.stacks.parent_stack_id)
      )
    )
    .prepare("highestOrderStacks");
  const res = await prep.execute({ id: mapId });
  return res;
}

export async function getDirectChildsFromParent(
  parentStackId: string,
  db: dbConnection
) {
  const prep = db
    .select()
    .from(schema.stacks)
    .where(eq(schema.stacks.parent_stack_id, sql.placeholder("id")))
    .prepare("childStacks");
  const res = await prep.execute({ id: parentStackId });
  return res;
}

export async function getAllChildsFromParent(
  stackId: string,
  db: dbConnection
) {
  const res = await db.execute(sql`
  WITH RECURSIVE cte_substacks AS (
      
      SELECT * FROM stacks WHERE stack_id=${stackId}
  
      UNION ALL
  
      SELECT stacks.* FROM stacks 
      JOIN cte_substacks ON stacks.parent_stack_id = cte_substacks.stack_id
      
      )
      SELECT * 
      FROM cte_substacks
  `);
  return res.rows;
}

export async function getStackById(stackId: string, db: dbConnection) {
  const prep = db
    .select()
    .from(schema.stacks)
    .where(eq(schema.stacks.stack_id, sql.placeholder("id")))
    .prepare("stack");
  const res = await prep.execute({ id: stackId });
  return res;
}

export async function changeParentStack(
  parentAndChild: types.ParentAndChildId,
  db: dbConnection
): Promise<schema.Stack[]> {
  const res = await db
    .update(schema.stacks)
    .set({ parent_stack_id: parentAndChild.new_parent_id })
    .where(eq(schema.stacks.stack_id, parentAndChild.child_id))
    .returning();
  return res;
}

export async function deleteParentStackRelation(
  childStackId: string,
  db: dbConnection
): Promise<schema.Stack[]> {
  const res = await db
    .update(schema.stacks)
    .set({ parent_stack_id: null })
    .where(eq(schema.stacks.stack_id, childStackId))
    .returning();
  return res;
}

export async function deleteMiddleOrderStackAndMoveChildsUp(stackId:string, db:dbConnection){
  const res = await db.transaction(async(tx) => {

    const deletedStack = await tx
    .delete(schema.stacks)
    .where(eq(schema.stacks.stack_id, stackId))
    .returning()
    
    const newParentId = deletedStack[0].parent_stack_id
    const oldParentId = deletedStack[0].stack_id
    const updatedStacks = await tx
    .update(schema.stacks)
    .set({
      parent_stack_id: newParentId
    })
    .where(eq(schema.stacks.parent_stack_id, oldParentId))
    .returning()
    return updatedStacks
  })
  return res 
}