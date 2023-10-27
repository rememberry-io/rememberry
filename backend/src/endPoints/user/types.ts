import { TRPCError } from "@trpc/server";
import * as schema from "../../db/schema";

export type UserStatus =
  | readonly [TRPCError, null]
  | readonly [null, schema.User];

export type UserLoginCredentials = {
  email: string;
  password: string;
};

export type UserRegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

export type UserCredentialCheckReturn = {
  userId: string;
  password: string;
};
