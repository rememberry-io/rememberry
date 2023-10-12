import { router, publicProcedure } from "../../trpc";
import z from "zod";
import { config } from "dotenv";
import * as schema from "../../db/schema";
import * as stackController from "./stackController";
import { privateProcedure } from "../../middleware/jwt";

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

  create: privateProcedure.input(stackInput).query(async (opts) => {
    const res = await stackController.controlCreateStack(
      opts.input
    );
    return res;
  }),

  getById: privateProcedure.input(z.string()).query(async(opts) => {
    const res = await stackController.controlGetStackById(opts.input)

    return res
  }),

  getOldestParentsFromMap: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res = await stackController.controlGetHighestOrderStacks(
        opts.input
      );
      return res;
    }),
    
  getDirectChilds: privateProcedure
      .input(z.string())
      .query(async (opts) => {
        const res = await stackController.controlGetDirectChildsFromParent(
          opts.input
        );
        return res;
      }),
      
  getAllChildren: privateProcedure
        .input(z.string())
        .query(async (opts) => {
          const res = await stackController.controlGetAllChildsFromParent(
            opts.input
          );
          return res;
        }),

  getAll: privateProcedure.input(z.string()).query(async (opts) => {
    const res = await stackController.controlGetAllStacksFromMap(
      opts.input
    );
    return res;
  }),

  getParent: privateProcedure.input(z.string()).query(async (opts) => {
    const res = await stackController.controlGetParentFromStack(
      opts.input
    );
    return res;
  }),

  changeParent: privateProcedure
    .input(changeParentStackInput)
    .mutation(async (opts) => {
      const res = await stackController.controlChangeParentStack(
        opts.input
      );
      return res;
    }),

  deleteParentRelation: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const res = await stackController.controlDeleteParentStackRelation(
        opts.input
      );
      return res;
    }),

  deleteAndMoveChildsUp: privateProcedure.input(z.string()).query(async(opts) => {
    const res = await stackController.controlStackDeletionAndChildMoveUp(opts.input)
    return res
  }),

  deleteWithAllChilds: privateProcedure.input(z.string()).query(async(opts) => {
    const res = await stackController.controlStackAndChildDeletion(opts.input)
    return res
  })
});

export type stackRouter = typeof stackRouter;
