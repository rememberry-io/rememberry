import { z } from "zod";
import { privateProcedure } from "../../middleware/jwt";
import { publicProcedure, router } from "../../trpc";
import * as userController from "./userController";
import { TRPCError } from "@trpc/server";

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
  refresh_token: z.string(),
});

export const userRouter = router({
  createUser: publicProcedure.input(createUserInput).mutation(async (opts) => {
    const res = await userController.controlUserCreation(opts.input);
    if (res instanceof TRPCError)
      throw res
    console.log(res);
    return res;
  }),

  updateUser: privateProcedure.input(User).query(async (opts) => {
    const res = await userController.controlUserUpdateById(opts.input);
    return res;
  }),

  deleteUserById: privateProcedure.input(User).mutation(async (opts) => {
    const res = await userController.controlUserDeletionById(
      opts.input.user_id,
    );
    return res;
  }),

  getAllUsers: privateProcedure.input(z.undefined()).query(async (opts) => {
    const res = await userController.getAllUsers();
    return res;
  }),

  getUserById: publicProcedure.input(User).query(async (opts) => {
    const res = await userController.getUserById(opts.input.user_id);
    return res;
  }),
});

export type userRouter = typeof userRouter;
