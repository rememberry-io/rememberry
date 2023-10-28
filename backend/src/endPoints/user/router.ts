import { z } from "zod";
import { privateProcedure } from "../../middleware/jwt";
import { publicProcedure, router } from "../../trpc";
import { userController } from "./user.controller";

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

const UpdateUser = z.object({
  userId: z.string(),
  user: User,
});

export const userRouter = router({
  //TODO: do we need this route?
  createUser: publicProcedure.input(createUserInput).mutation(async (opts) => {
    const res = await userController.createUser(opts.input);
    if (res[0]) throw res[0];
    return res[1];
  }),

  //TODO: do we need this route?
  getAllUsers: privateProcedure.input(z.undefined()).query(async (opts) => {
    const res = await userController.getAllUsers();
    return res;
  }),

  getUserById: publicProcedure.input(z.string()).query(async (opts) => {
    const userId = opts.input;
    const res = await userController.getUserById(userId);
    if (res[0]) throw res[0];
    return res[1];
  }),

  updateUser: privateProcedure.input(UpdateUser).query(async (opts) => {
    const res = await userController.updateUserById(
      opts.input.userId,
      opts.input.user,
    );
    if (res[0]) throw res[0];
    return res[1];
  }),

  deleteUserById: privateProcedure.input(z.string()).mutation(async (opts) => {
    const userId = opts.input;
    const res = await userController.deleteUserById(userId);
    if (res[0]) throw res[0];
    return res[1];
  }),
});

export type userRouter = typeof userRouter;
