import { z } from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { UpdateUserByIdRouteInput, UserRouterOutput } from "./types";
import { userController } from "./user.controller";

export const userRouter = router({
  getUserBySession: privateProcedure
    .output(UserRouterOutput)
    .query(async (opts) => {
      const [errorCheck, user] = await userController.getUserBySession(
        opts.ctx,
      );
      if (errorCheck) {
        throw errorCheck;
      }

      return user;
    }),
  updateUserById: privateProcedure
    .input(UpdateUserByIdRouteInput)
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      const { id, username, email, password } = opts.input;
      const [errorCheck, user] = await userController.updateUserById({
        id,
        username,
        email,
        password,
      });
      if (errorCheck) {
        throw errorCheck;
      }
      return user;
    }),
  deleteUserById: privateProcedure.input(z.string()).mutation(async (opts) => {
    const [errorCheck, res] = await userController.deleteUserById(opts.input);
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),
});

export type userRouter = typeof userRouter;
