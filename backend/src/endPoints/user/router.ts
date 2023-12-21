import { z } from "zod";
import { privateProcedure } from "../../middleware/jwt";
import { publicProcedure, router } from "../../trpc";
import * as userController from "./userController";

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
    const [errorCheck, res] = await userController.controlUserCreation(
      opts.input,
    );
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),

  updateUser: privateProcedure.input(User).query(async (opts) => {
    const [errorCheck, res] = await userController.controlUserUpdateById(
      opts.input.password,
      opts.input.email,
      opts.input.username,
      opts.input.user_id,
    );
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),

  deleteUserById: privateProcedure.input(User).mutation(async (opts) => {
    const [errorCheck, res] = await userController.controlUserDeletionById(
      opts.input.user_id,
    );
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),

  getAllUsers: privateProcedure.input(z.undefined()).query(async () => {
    const [errorCheck, res] = await userController.getAllUsers();
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),

  getUserById: publicProcedure.input(User).query(async (opts) => {
    const [errorCheck, res] = await userController.getUserById(
      opts.input.user_id,
    );
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),
});

export type userRouter = typeof userRouter;
