import { and, eq, isNull, sql } from "drizzle-orm";
import { db, dbConnection } from "../../db/db";
import { NewNode, Node, nodes } from "../../db/schema";
import {
  TRPCStatus,
  getModelDefaultError,
  getTRPCError,
  hasOnlyOneEntry,
} from "../../utils";

export interface StackModel {
  createStack: (input: NewNode) => Promise<TRPCStatus<Node>>;
  getStackById: (stackId: string) => Promise<TRPCStatus<Node>>;
  getStacksByMapId: (mapId: string) => Promise<TRPCStatus<Node[]>>;
  getTopLevelStacksByMapId: (mapId: string) => Promise<TRPCStatus<Node[]>>;
  getDirectChildrenStacksFromParentStack: (
    stackId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  getAllChildrenStacksFromParentStack: (
    stackId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  updateStackById: (stack: Node) => Promise<TRPCStatus<Node>>;
  changeParentStack: (
    parentId: string,
    stackId: string,
  ) => Promise<TRPCStatus<Node>>;
  deleteParentStackRelation: (stackId: string) => Promise<TRPCStatus<Node>>;
  deleteMiddleOrderStackAndMoveChildrenUp: (
    stackId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  deleteStackAndChildren: (stackId: string) => Promise<TRPCStatus<Node[]>>;
}

class StackModelDrizzle implements StackModel {
  db: dbConnection;
  constructor(db: dbConnection) {
    this.db = db;
  }

  async createStack(input: NewNode) {
    try {
      const stack = await this.db.insert(nodes).values(input).returning();

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
        .from(nodes)
        .where(eq(nodes.id, sql.placeholder("id")))
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
        .from(nodes)
        .where(eq(nodes.mapId, sql.placeholder("id")))
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
        .from(nodes)
        .where(
          and(
            eq(nodes.mapId, sql.placeholder("id")),
            isNull(nodes.parentNodeId),
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
        .from(nodes)
        .where(eq(nodes.parentNodeId, sql.placeholder("id")))
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
      return [null, returnedStacks.rows as Node[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async updateStackById(stack: Node) {
    try {
      const updatedStack = await this.db
        .update(nodes)
        .set(stack)
        .where(eq(nodes.id, stack.id))
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
        .update(nodes)
        .set({ parentNodeId: parentId })
        .where(eq(nodes.id, stackId))
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
        .update(nodes)
        .set({ parentNodeId: null })
        .where(eq(nodes.id, stackId))
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
          .select({ parentId: nodes.parentNodeId })
          .from(nodes)
          .where(eq(nodes.id, stackId));
        const newParentId = stackToDelete[0].parentId;

        const updatedStacks = await tx
          .update(nodes)
          .set({
            parentNodeId: newParentId,
          })
          .where(eq(nodes.parentNodeId, stackId))
          .returning();

        //delete the middle stack
        await tx.delete(nodes).where(eq(nodes.id, stackId));

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
      return [null, res.rows as Node[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
}

export const stackModelDrizzle = new StackModelDrizzle(db);
