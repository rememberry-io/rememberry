import { User } from "lucia";
import { privateProcedure } from "../../middleware/validateSession";
import { publicProcedure, router } from "../../trpc";
import { UserRouterOutput } from "../user/types";
import { luciaAuthentication } from "./auth.controller";
import { LoginRouteInput, RegisterRouteInput } from "./types";

export const authRouter = router({
  register: publicProcedure
    .input(RegisterRouteInput)
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      //return "hello"
      const [errorCheck, res] = await luciaAuthentication.register(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
      opts.ctx.res.setHeader("Location", "/");
      return res.user as User;
    }),
  login: publicProcedure
    .input(LoginRouteInput)
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.login(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
      opts.ctx.res.setHeader("Location", "/");
      return res.user;
    }),
  logout: privateProcedure.mutation(async (opts) => {
    const [errorCheck, res] = await luciaAuthentication.logout({ opts });
    if (errorCheck) {
      throw errorCheck;
    }
    opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
    opts.ctx.res.setHeader("Location", "/login");
  }),
});

export type authRouter = typeof authRouter;
