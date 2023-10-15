import { router, publicProcedure } from "../../trpc";
import z from "zod";
import { config } from "dotenv";
import * as schema from "../../db/schema";
import * as loginController from "./loginController";
import { readUserById } from "../user/user.model";
import * as types from "./types";
import jwt, { Jwt } from "jsonwebtoken";
config();

export const loginRouter = router({
  loginUser: publicProcedure
    .input(types.LoginCredentialsSchema)
    .query(async (opts) => {
      const res = loginController.controlLogin(opts.input);
      return res;
    }),

  registerUser: publicProcedure
    .input(types.registerInput)
    .query(async (opts) => {
      const res = await loginController.controlRegistration(opts.input);
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
