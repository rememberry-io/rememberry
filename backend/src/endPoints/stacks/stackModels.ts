import { TRPCError } from "@trpc/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";
import * as types from "./types";

const database = drizzle(client, { schema });

const internalServerError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

export async function createStack(stack: schema.NewStack, date: Date) {
  const res = await database
    .insert(schema.stacks)
    .values({
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
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res] as const;
}

export async function getStacksFromMap(mapId: string) {
  try {
    const prep = database
      .select()
      .from(schema.stacks)
      .where(eq(schema.stacks.map_id, sql.placeholder("id")))
      .prepare("stacks");
    const res = await prep.execute({ id: mapId });
    return [null, res] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function getHighestOrderParentStacks(mapId: string) {
  try {
    const prep = database
      .select()
      .from(schema.stacks)
      .where(
        and(
          eq(schema.stacks.map_id, sql.placeholder("id")),
          isNull(schema.stacks.parent_stack_id),
        ),
      )
      .prepare("highestOrderStacks");
    const res = await prep.execute({ id: mapId });
    return [null, res] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function getDirectChildsFromParent(parentStackId: string) {
  try {
    const prep = database
      .select()
      .from(schema.stacks)
      .where(eq(schema.stacks.parent_stack_id, sql.placeholder("id")))
      .prepare("childStacks");
    const res = await prep.execute({ id: parentStackId });
    return [null, res] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function getAllChildsFromParent(stackId: string) {
  try {
    const res = await database.execute(sql`
    WITH RECURSIVE cte_substacks AS (
        
        SELECT * FROM stacks WHERE stack_id=${stackId}
    
        UNION ALL
    
        SELECT stacks.* FROM stacks 
        JOIN cte_substacks ON stacks.parent_stack_id = cte_substacks.stack_id
        
        )
        SELECT * 
        FROM cte_substacks
    `);
    return [null, res.rows] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function getStackById(stackId: string) {
  try {
    const prep = database
      .select()
      .from(schema.stacks)
      .where(eq(schema.stacks.stack_id, sql.placeholder("id")))
      .prepare("stack");
    const res = await prep.execute({ id: stackId });
    return [null, res] as const;
  } catch (error) {
    return [error, null] as const;
  }
}

export async function changeParentStack(
  parentAndChild: types.ParentAndChildId,
) {
  const res = await database
    .update(schema.stacks)
    .set({ parent_stack_id: parentAndChild.new_parent_id })
    .where(eq(schema.stacks.stack_id, parentAndChild.child_id))
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function deleteParentStackRelation(childStackId: string) {
  const res = await database
    .update(schema.stacks)
    .set({ parent_stack_id: null })
    .where(eq(schema.stacks.stack_id, childStackId))
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function deleteMiddleOrderStackAndMoveChildsUp(stackId: string) {
  const res = await database.transaction(async (tx) => {
    const stackToDelete = await tx
      .select({ parentId: schema.stacks.parent_stack_id })
      .from(schema.stacks)
      .where(eq(schema.stacks.stack_id, stackId));
    const newParentId = stackToDelete[0].parentId;

    const updatedStacks = await tx
      .update(schema.stacks)
      .set({
        parent_stack_id: newParentId,
      })
      .where(eq(schema.stacks.parent_stack_id, stackId))
      .returning();

    const stackDeletion = await tx
      .delete(schema.stacks)
      .where(eq(schema.stacks.stack_id, stackId));
    return updatedStacks;
  });
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res] as const;
}
export async function deleteStackAndChildren(stackId: string) {
  try {
    const res = await database.execute(sql`
      WITH RECURSIVE stacks_to_delete AS(
        SELECT stack_id FROM stacks
        WHERE stack_id=${stackId}
  
        UNION
  
        SELECT stacks.stack_id
        FROM stacks
        JOIN stacks_to_delete ON stacks.parent_stack_id = stacks_to_delete.stack_id
      )
      DELETE FROM stacks
      WHERE stack_id IN(SELECT stack_id FROM stacks_to_delete)
    `);
    return [null, res.rows];
  } catch (error) {
    return [error, null];
  }
}
