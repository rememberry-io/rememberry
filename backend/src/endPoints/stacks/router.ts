import { router, publicProcedure } from "../../trpc";
import * as stackModels from "./stackModels";
import z from "zod";
import { config } from "dotenv";
import * as schema from '../../db/schema'

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
  parent_stack_id: z.string().optional()
})

const changeParentStackInput = z.object({
  child_id : z.string(),
  new_parent_id: z.string()
})



export const stackRouter = router({

  createStack : publicProcedure.input(stackInput).query(async(opts) => {
    const res = await stackModels.createStack(opts.input, opts.ctx.db)
    return res
  }),

  getMapsHighestOrderParents: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackModels.getHighestOrderParentStacks(opts.input, opts.ctx.db)
    return res 
  }),

  getAllStacksFromMap : publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackModels.getStacksFromMap(opts.input, opts.ctx.db)
    return res
  }),

  getStacksFromParent : publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackModels.getStacksFromParent(opts.input, opts.ctx.db)
    return res
  }),

  getAllChildsFromParent: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackModels.getAllChildsFromParent(opts.input, opts.ctx.db)
    return res
  }),

  getStackById: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackModels.getParentFromStack(opts.input, opts.ctx.db)
    return res 
  }),

  changeParentStack: publicProcedure.input(changeParentStackInput).query(async(opts) => {
    const res = await stackModels.changeParentStack(opts.input, opts.ctx.db)
    return res 
  }),

  deleteParentStackRelation: publicProcedure.input(z.string()).query(async(opts) => {
    const res = await stackModels.deleteParentStackRelation(opts.input, opts.ctx.db)
    return res 
  }),
  
})


export type stackRouter = typeof stackRouter