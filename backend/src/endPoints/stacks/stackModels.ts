import { and, eq, isNull, sql } from "drizzle-orm";
import { db, dbConnection } from "../../db/db";
import { NewStack, Stack, stacks } from "../../db/schema";
import {
  getModelDefaultError,
  getTRPCError,
  hasOnlyOneEntry,
} from "../../utils";
import { TRPCStatus } from "../auth/types";

export interface StackModel {
  createStack: (input: NewStack) => Promise<TRPCStatus<Stack>>;
  getStackById: (stackId: string) => Promise<TRPCStatus<Stack>>;
  getStacksByMapId: (mapId: string) => Promise<TRPCStatus<Stack[]>>;
  getTopLevelStacksByMapId: (mapId: string) => Promise<TRPCStatus<Stack[]>>;
  getDirectChildrenStacksFromParentStack: (
    stackId: string,
  ) => Promise<TRPCStatus<Stack[]>>;
  getAllChildrenStacksFromParentStack: (
    stackId: string,
  ) => Promise<TRPCStatus<Stack[]>>;
  updateStackById: (stack: Stack) => Promise<TRPCStatus<Stack>>;
  changeParentStack: (
    parentId: string,
    stackId: string,
  ) => Promise<TRPCStatus<Stack>>;
  deleteParentStackRelation: (stackId: string) => Promise<TRPCStatus<Stack>>;
  deleteMiddleOrderStackAndMoveChildrenUp: (
    stackId: string,
  ) => Promise<TRPCStatus<Stack[]>>;
  deleteStackAndChildren: (stackId: string) => Promise<TRPCStatus<Stack[]>>;
}

class StackModelDrizzle implements StackModel {
  db: dbConnection;
  constructor(db: dbConnection) {
    this.db = db;
  }

  async createStack(input: NewStack) {
    try {
      const stack = await this.db.insert(stacks).values(input).returning();

      if (!hasOnlyOneEntry(stack)) getTRPCError();
      return [null, stack[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getStackById(stackId: string) {
    try {
      const prep = this.db
        .select()
        .from(stacks)
        .where(eq(stacks.id, sql.placeholder("id")))
        .prepare("stack");
      const stack = await prep.execute({ id: stackId });

      if (!hasOnlyOneEntry(stack)) return getTRPCError();

      return [null, stack[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getStacksByMapId(mapId: string) {
    try {
      const prep = this.db
        .select()
        .from(stacks)
        .where(eq(stacks.mapId, sql.placeholder("id")))
        .prepare("stacks");
      const map = await prep.execute({ id: mapId });

      return [null, map] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  /**
   * Get all top Level Stacks (that have no other stack)
   */
  async getTopLevelStacksByMapId(mapId: string) {
    try {
      const prep = this.db
        .select()
        .from(stacks)
        .where(
          and(
            eq(stacks.mapId, sql.placeholder("id")),
            isNull(stacks.parentStackId),
          ),
        )
        .prepare("highestOrderStacks");
      const returnedStacks = await prep.execute({ id: mapId });
      return [null, returnedStacks] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getDirectChildrenStacksFromParentStack(stackId: string) {
    try {
      const prep = this.db
        .select()
        .from(stacks)
        .where(eq(stacks.parentStackId, sql.placeholder("id")))
        .prepare("childStacks");
      const returnedStacks = await prep.execute({ id: stackId });
      return [null, returnedStacks] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getAllChildrenStacksFromParentStack(stackId: string) {
    try {
      const returnedStacks = await this.db.execute(sql`
        WITH RECURSIVE cte_substacks AS (
        
        SELECT * FROM stacks WHERE stack_id=${stackId}
    
        UNION ALL
    
        SELECT stacks.* FROM stacks 
        JOIN cte_substacks ON stacks.parent_stack_id = cte_substacks.stack_id
        
        )
        SELECT * 
        FROM cte_substacks
      `);
      return [null, returnedStacks.rows as Stack[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async updateStackById(stack: Stack) {
    try {
      const updatedStack = await this.db
        .update(stacks)
        .set(stack)
        .where(eq(stacks.id, stack.id))
        .returning();
      if (!hasOnlyOneEntry(updatedStack)) return getTRPCError();
      return [null, updatedStack[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async changeParentStack(parentId: string, stackId: string) {
    try {
      const stack = await this.db
        .update(stacks)
        .set({ parentStackId: parentId })
        .where(eq(stacks.id, stackId))
        .returning();

      if (!hasOnlyOneEntry(stack)) getTRPCError();

      return [null, stack[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async deleteParentStackRelation(stackId: string) {
    try {
      const stack = await this.db
        .update(stacks)
        .set({ parentStackId: null })
        .where(eq(stacks.id, stackId))
        .returning();

      if (!hasOnlyOneEntry(stack)) getTRPCError();
      return [null, stack[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async deleteMiddleOrderStackAndMoveChildrenUp(stackId: string) {
    try {
      const returnedStacks = await this.db.transaction(async (tx) => {
        const stackToDelete = await tx
          .select({ parentId: stacks.parentStackId })
          .from(stacks)
          .where(eq(stacks.id, stackId));
        const newParentId = stackToDelete[0].parentId;

        const updatedStacks = await tx
          .update(stacks)
          .set({
            parentStackId: newParentId,
          })
          .where(eq(stacks.parentStackId, stackId))
          .returning();

        //delete the middle stack
        await tx.delete(stacks).where(eq(stacks.id, stackId));

        return updatedStacks;
      });
      return [null, returnedStacks] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
  async deleteStackAndChildren(stackId: string) {
    try {
      const res = await this.db.execute(sql`
        WITH RECURSIVE stacks_to_delete AS(
        SELECT id FROM stacks
        WHERE id =${stackId}
  
        UNION
  
        SELECT stacks.id
        FROM stacks
        JOIN stacks_to_delete ON stacks.parent_stack_id = stacks_to_delete.id
        )
        DELETE FROM stacks
        WHERE id IN(SELECT id FROM stacks_to_delete)
      `);
      return [null, res.rows as Stack[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
}

export const stackModelDrizzle = new StackModelDrizzle(db);
