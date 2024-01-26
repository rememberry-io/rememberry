import { TRPCError } from "@trpc/server";
import { LuciaError } from "lucia";
import { Auth, auth } from "../../auth/lucia";
import { TRPCStatus } from "../auth/types";
import {
  GetUserBySessionInput,
  UpdatePasswordInput,
  UpdateUsernameAndEmailInput,
  UserControllerOutput,
} from "./types";

interface UserController {
  getUserBySession(
    input: GetUserBySessionInput,
  ): Promise<TRPCStatus<UserControllerOutput>>;
  updateUsernameAndEmail(
    input: UpdateUsernameAndEmailInput,
  ): Promise<TRPCStatus<UserControllerOutput>>;
  updatePassword(
    input: UpdatePasswordInput,
  ): Promise<TRPCStatus<UserControllerOutput>>;
  deleteUserById(userId: string): Promise<TRPCStatus<string>>;
}

class LuciaUserController implements UserController {
  auth: Auth;
  constructor(auth: Auth) {
    this.auth = auth;
  }
  async getUserBySession(input: GetUserBySessionInput) {
    const authRequest = this.auth.handleRequest(input.req, input.res);

    const session = await authRequest.validate();

    if (!session) {
      return [
        new TRPCError({
          code: "UNAUTHORIZED",
        }),
        null,
      ] as const;
    }
    const payload = {
      user: session.user,
    };

    return [null, payload] as const;
  }
  async updateUsernameAndEmail(input: UpdateUsernameAndEmailInput) {
    const { username, email, userId } = input;
    try {
      const user = await this.auth.updateUserAttributes(userId, {
        username,
        email,
      });
      const payload = {
        user,
      };
      return [null, payload] as const;
    } catch (e) {
      if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
        return [
          new TRPCError({ code: "BAD_REQUEST", message: "Invalid user id" }),
          null,
        ] as const;
      }
    }
    return [
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid user id",
      }),
      null,
    ] as const;
  }
  //TODO: unvalidate all session (and send a new session so user stays logged in)
  async updatePassword(input: UpdatePasswordInput) {
    const { email, newPassword } = input;
    try {
      const key = await this.auth.updateKeyPassword(
        "email",
        email,
        newPassword,
      );
      const user = await this.auth.getUser(key.userId);

      const payload = {
        user,
      };

      return [null, payload] as const;
    } catch (e) {
      if (e instanceof LuciaError && e.message === "AUTH_INVALID_KEY_ID") {
        return [
          new TRPCError({ code: "BAD_REQUEST", message: "Invalid key id" }),
          null,
        ] as const;
      }
      return [
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid user id",
        }),
        null,
      ] as const;
    }
  }
  async deleteUserById(userId: string) {
    await this.auth.deleteUser(userId);
    return [null, "Successfully deleted user"] as const;
  }
}

export const userController = new LuciaUserController(auth);
