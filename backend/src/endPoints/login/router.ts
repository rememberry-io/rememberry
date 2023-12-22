import { publicProcedure, router } from "../../trpc";
import * as types from "./types";
import { luciaAuthentication } from "./auth.controller";

export const authRouter = router({
  register: publicProcedure
    .input(types.registerInput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.register(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie)
      return res.user;
    }),
  login: publicProcedure
    .input(types.LoginCredentialsSchema)
    .query(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.login(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie)
      return res.user;
    }),
  logout: publicProcedure
    .query(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.logout({ opts });
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie)
      return res.user;
    }),

  // refreshToken: publicProcedure
  //   .input(types.refreshTokenInputSchema)
  //   .query(async (opts) => {
  //     const res = await loginController.refreshAccessToken(opts.input);
  //     return res;
  //   }),
});

export type authRouter = typeof authRouter;
