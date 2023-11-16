import { config } from "dotenv";
import z from "zod";
import { privateProcedure } from "../../middleware/jwt";
import { router } from "../../trpc";
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
  create: privateProcedure.input(stackInput).query(async (opts) => {
    const [errorCheck, res] = await stackController.controlCreateStack(opts.input);
    if(errorCheck){
      throw errorCheck
    }
    return res;
  }),

  getById: privateProcedure.input(z.string()).query(async (opts) => {
    const [errorCheck, res] = await stackController.controlGetStackById(opts.input);
    if(errorCheck){
      throw errorCheck
    }
      return res
  }),

  getOldestParentsFromMap: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] = await stackController.controlGetHighestOrderStacks(
        opts.input,
      );
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),

  getDirectChilds: privateProcedure.input(z.string()).query(async (opts) => {
    const [errorCheck, res] = await stackController.controlGetDirectChildsFromParent(
      opts.input,
    );
    if(errorCheck){
      throw errorCheck
    }
    return res;
  }),

  getAllChildren: privateProcedure.input(z.string()).query(async (opts) => {
    const [errorCheck, res] = await stackController.controlGetAllChildsFromParent(opts.input);
    if(errorCheck){
      throw errorCheck
    }
    return res;
  }),

  getAll: privateProcedure.input(z.string()).query(async (opts) => {
    const [errorCheck, res] = await stackController.controlGetAllStacksFromMap(opts.input);
    if(errorCheck){
      throw errorCheck
    }
    return res;
  }),

  getParent: privateProcedure.input(z.string()).query(async (opts) => {
    const [errorCheck, res] = await stackController.controlGetParentFromStack(opts.input);
    if(errorCheck){
      throw errorCheck
    }
    return res;
  }),

  changeParent: privateProcedure
    .input(changeParentStackInput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await stackController.controlChangeParentStack(opts.input);
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),

  deleteParentRelation: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [errorCheck, res] = await stackController.controlDeleteParentStackRelation(
        opts.input,
      );
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),

  deleteAndMoveChildsUp: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] = await stackController.controlStackDeletionAndChildMoveUp(
        opts.input,
      );
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),

  deleteWithAllChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] = await stackController.controlStackAndChildDeletion(
        opts.input,
      );
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),
});

export type stackRouter = typeof stackRouter;
