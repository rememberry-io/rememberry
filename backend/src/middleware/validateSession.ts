import { TRPCError } from "@trpc/server";
import { auth } from "../auth/lucia";
import { middleware, publicProcedure } from "../trpc";

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req, res } = ctx;
  const authRequest = auth.handleRequest(req, res);

  const session = await authRequest.validate();
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next();
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
