import { router, publicProcedure } from "../../trpc";
import z from "zod";
import { config } from "dotenv";
import * as schema from "../../db/schema";
import * as stackController from "./stackController";

config();

const stackInput = z.object({
  stack_id: z.string().optional(),
  stack_name: z.string(),
  number_of_learned_cards: z.number().optional(),
  number_of_unlearned_cards: z.number().optional(),
  created_at: z.date().optional(),
  map_id: z.string(),
  stack_description: z.string(),
  positioning: z.string().optional(),
  parent_stack_id: z.string().optional(),
});

const changeParentStackInput = z.object({
  child_id: z.string(),
  new_parent_id: z.string(),
});

export const stackRouter = router({

  create: publicProcedure.input(stackInput).mutation(async (opts) => {
    const res = await stackController.controlCreateStack(
      opts.input
    );
    return res;
  }),

  getById: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackController.controlGetStackById(opts.input, opts.ctx.db)
    return res
  }),

  getOldestParentsFromMap: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const res = await stackController.controlGetHighestOrderStacks(
        opts.input,
        opts.ctx.db
      );
      return res;
    }),
    
  getDirectChilds: publicProcedure
      .input(z.string())
      .query(async (opts) => {
        const res = await stackController.controlGetDirectChildsFromParent(
          opts.input,
          opts.ctx.db
        );
        return res;
      }),
      
  getAllChildren: publicProcedure
        .input(z.string())
        .query(async (opts) => {
          const res = await stackController.controlGetAllChildsFromParent(
            opts.input,
            opts.ctx.db
          );
          return res;
        }),

  getAll: publicProcedure.input(z.string()).query(async (opts) => {
    const res = await stackController.controlGetAllStacksFromMap(
      opts.input,
      opts.ctx.db
    );
    return res;
  }),

  getParent: publicProcedure.input(z.string()).query(async (opts) => {
    const res = await stackController.controlGetParentFromStack(
      opts.input,
      opts.ctx.db
    );
    return res;
  }),

  changeParent: publicProcedure
    .input(changeParentStackInput)
    .mutation(async (opts) => {
      const res = await stackController.controlChangeParentStack(
        opts.input,
        opts.ctx.db
      );
      return res;
    }),

  deleteParentRelation: publicProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const res = await stackController.controlDeleteParentStackRelation(
        opts.input,
        opts.ctx.db
      );
      return res;
    }),

  deleteAndMoveChildsUp: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackController.controlStackDeletionAndChildMoveUp(opts.input, opts.ctx.db)
    return res
  }),

  deleteWithAllChilds: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackController.controlStackAndChildDeletion(opts.input, opts.ctx.db)
    return res
  })
});

export type stackRouter = typeof stackRouter;
