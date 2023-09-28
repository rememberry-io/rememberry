import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import * as userModel from '../user/user.model'
import * as schema from '../db/schema'
import { AnyRouter, Router } from "@trpc/server";


const createUserInput = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string()
})
const User = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  user_id: z.string()
})


export const userRouter = router({

  createUser: publicProcedure.input(createUserInput).query(async (opts) => {
      const res = await userModel.createUser(opts.input, opts.ctx.db)
      return res
    }
  ),

  updateUser: publicProcedure.input(User).query(async(opts)=>{
    const res = await userModel.updateUserById(opts.input, opts.ctx.db)
    return res
  }),

  deleteUserById: publicProcedure.input(User).query(async(opts)=>{
    const res = await userModel.deleteUserById(opts.input.user_id, opts.ctx.db)
    return res
  }),

  getAllUsers: publicProcedure.input(z.null()).query(async(opts)=>{
    const res = await userModel.getAllUsers(opts.ctx.db)
    return res
  }),

  getUserById: publicProcedure.input(User).query(async(opts)=>{
    const res = await userModel.getUserById(opts.input.user_id, opts.ctx.db)
    return res
  }),

})



export type userRouter = typeof userRouter;
