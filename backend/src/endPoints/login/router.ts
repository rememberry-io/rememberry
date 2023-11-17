import { config } from "dotenv";
import { publicProcedure, router } from "../../trpc";
import * as loginController from "./loginController";
import * as types from "./types";
config();

export const loginRouter = router({
  loginUser: publicProcedure
    .input(types.LoginCredentialsSchema)
    .query(async (opts) => {
      const [errorCheck, res] = await loginController.controlLogin(opts.input);
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),

  registerUser: publicProcedure
    .input(types.registerInput)
    .query(async (opts) => {
      const [errorCheck, res] = await loginController.controlRegistration(opts.input);
      if(errorCheck){
        throw errorCheck
      }
      return res;
    }),

  refreshToken: publicProcedure
    .input(types.refreshTokenInputSchema)
    .query(async (opts) => {
      const res = await loginController.refreshAccessToken(opts.input);
      return res;
    }),
});

export type loginRouter = typeof loginRouter;
