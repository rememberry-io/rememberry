import { publicProcedure, router } from "../../trpc";
import { luciaAuthentication } from "./auth.controller";
import { LoginRouteInput, RegisterRouteInput } from "./types";

export const authRouter = router({
  register: publicProcedure.input(RegisterRouteInput).mutation(async (opts) => {
    const [errorCheck, res] = await luciaAuthentication.register(opts.input);
    if (errorCheck) {
      throw errorCheck;
    }
    opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
    return res.user;
  }),
  login: publicProcedure.input(LoginRouteInput).query(async (opts) => {
    const [errorCheck, res] = await luciaAuthentication.login(opts.input);
    if (errorCheck) {
      throw errorCheck;
    }
    opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
    return res.user;
  }),
  logout: publicProcedure.query(async (opts) => {
    const [errorCheck, res] = await luciaAuthentication.logout({ opts });
    if (errorCheck) {
      throw errorCheck;
    }
    opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
    return res.user;
  }),
});

export type authRouter = typeof authRouter;
