import { z } from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import {
  UpdatePasswordRouteInput,
  UpdateUsernameAndEmailRouteInput,
  UserRouterOutput,
} from "./types";
import { userController } from "./user.controller";

export const userRouter = router({
  getUserBySession: privateProcedure
    .output(UserRouterOutput)
    .query(async (opts) => {
      const [errorCheck, res] = await userController.getUserBySession(opts.ctx);
      if (errorCheck) {
        throw errorCheck;
      }

      return res.user;
    }),
  updateUsernameAndEmail: privateProcedure
    .input(UpdateUsernameAndEmailRouteInput)
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await userController.updateUsernameAndEmail(
        opts.input,
      );
      if (errorCheck) {
        throw errorCheck;
      }
      return res.user;
    }),
  updatePassword: privateProcedure
    .input(UpdatePasswordRouteInput)
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await userController.updatePassword(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      return res.user;
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
