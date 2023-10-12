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


  createUser: publicProcedure.input(createUserInput).query(async (opts) => {
    const res = await userController.controlUserCreation(
      opts.input
    );
    return res;
  }),

  updateUser: publicProcedure.input(User).query(async (opts) => {
    const res = await userController.controlUserUpdateById(
      opts.input,
    );
    return res;
  }),

  deleteUserById: publicProcedure.input(User).mutation(async (opts) => {
    const res = await userController.controlUserDeletionById(
      opts.input.user_id
    );
    return res;
  }),

  getAllUsers: publicProcedure.input(z.undefined()).query(async (opts) => {
    const res = await userController.getAllUsers();
    return res;
  }),

  getUserById: publicProcedure.input(User).query(async (opts) => {
    const res = await userController.getUserById(
      opts.input.user_id
    );
    return res;
  }),
});

export type userRouter = typeof userRouter;
