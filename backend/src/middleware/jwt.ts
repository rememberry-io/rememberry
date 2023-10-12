import { router, middleware, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { TRPCError } from "@trpc/server";
import { signAccessToken } from "../endPoints/login/loginController";
config();

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req } = ctx;
  const token = req.headers.authorization?.split(' ')[1]
  if(!token){
    throw new TRPCError({code: "UNAUTHORIZED"})
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
  return next()
});

const refreshAccessToken = middleware(async ({next, ctx}) => {

  return next()
})

export const privateProcedure = publicProcedure.use(isLoggedIn);
