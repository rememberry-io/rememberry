import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import * as userModel from "./user.model";
import * as userController from "./userController";
import * as schema from "../../db/schema";

const createUserInput = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});
const User = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  user_id: z.string(),
});

export const userRouter = router({
  createUser: publicProcedure.input(createUserInput).mutation(async (opts) => {
    const res = await userController.controlUserCreation(opts.input, opts.ctx.db);
    return res;
  }),

  updateUser: publicProcedure.input(User).mutation(async (opts) => {
    const res = await userController.controlUserUpdateById(opts.input, opts.ctx.db);
    return res;
  }),

  deleteUserById: publicProcedure.input(User).mutation(async (opts) => {
    const res = await userController.controlUserDeletionById(opts.input.user_id, opts.ctx.db);
    return res;
  }),

  getAllUsers: publicProcedure.input(z.null()).query(async (opts) => {
    const res = await userController.getAllUsers(opts.ctx.db);
    return res;
  }),

  getUserById: publicProcedure.input(User).query(async (opts) => {
    const res = await userController.getUserById(opts.input.user_id, opts.ctx.db);
    return res;
  }),
});

export type userRouter = typeof userRouter;
