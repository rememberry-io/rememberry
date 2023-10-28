import { config } from "dotenv";
import { publicProcedure, router } from "../../trpc";
import { authenticationController } from "./authentication.controller";
import * as types from "./types";
config();

export const loginRouter = router({
  loginUser: publicProcedure
    .input(types.LoginCredentialsSchema)
    .query(async (opts) => {
      const [errorLogin, loggedInUser] =
        await authenticationController.login(opts.input);
      if (errorLogin) throw errorLogin;
      return loggedInUser;
    }),

  registerUser: publicProcedure
    .input(types.registerInput)
    .query(async (opts) => {
      const [errorRegister, registeredUser] =
        await authenticationController.registration(opts.input);
      if (errorRegister) throw errorRegister;
      return registeredUser;
    }),

  refreshToken: publicProcedure
    .input(types.refreshTokenInputSchema)
    .query(async (opts) => {
      const [errorRefreshAccessToken, refreshTokens] =
        await authenticationController.refreshAccessToken(
          opts.input.refreshToken,
        );
      if (errorRefreshAccessToken) throw errorRefreshAccessToken;
      return refreshTokens;
    }),
});

export type loginRouter = typeof loginRouter;
