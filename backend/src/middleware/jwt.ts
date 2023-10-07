import { router, middleware, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { TRPCError } from "@trpc/server";
config();

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req } = ctx;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Token is required" });

  const key = process.env.ACCESS_TOKEN_SECRET;
  if (!key)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Server configuration error",
    });

  try {
    const payload = jwt.verify(token, key);
    console.log(payload);

    return next({
      ctx: {
        payload,
        test: "hs",
      },
    });
  } catch (err) {
    console.error(err); // Log the error to console or a logging service
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
