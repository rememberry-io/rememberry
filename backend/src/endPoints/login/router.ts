import { config } from "dotenv";
import { publicProcedure, router } from "../../trpc";
import * as types from "./types";
import { loginRegistrationController } from "./loginRegistration.controller";
config();

export const loginRouter = router({
  loginUser: publicProcedure
    .input(types.LoginCredentialsSchema)
    .query(async (opts) => {
      const res = await loginRegistrationController.login(opts.input);
      if (res[0])
        throw res[0]
      return res[1];
    }),

  registerUser: publicProcedure
    .input(types.registerInput)
    .query(async (opts) => {
      const res = await loginRegistrationController.registration(opts.input);
      if (res[0])
        throw res[0]
      return res[1];
    }),

  refreshToken: publicProcedure
    .input(types.refreshTokenInputSchema)
    .query(async (opts) => {
      const res = await loginRegistrationController.refreshAccessToken(opts.input.refreshToken);
      if (res[0])
        throw res[0]
      return res[1];
    }),
});

export type loginRouter = typeof loginRouter;
