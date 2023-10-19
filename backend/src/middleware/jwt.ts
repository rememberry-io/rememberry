import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { middleware, publicProcedure } from "../trpc";
import env from "../env"

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req } = ctx;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  return next();
});

const refreshAccessToken = middleware(async ({ next, ctx }) => {
  return next();
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
