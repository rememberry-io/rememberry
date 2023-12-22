import { z } from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import {
  UpdatePasswordRouteInput,
  UpdateUsernameAndEmailRouteInput,
} from "./types";
import { userController } from "./user.controller";

export const userRouter = router({
  getUserBySession: privateProcedure.query(async (opts) => {
    const [errorCheck, res] = await userController.getUserBySession(opts.ctx);
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),
  updateUsernameAndEmail: privateProcedure
    .input(UpdateUsernameAndEmailRouteInput)
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
