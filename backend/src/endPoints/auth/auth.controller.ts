import { TRPCError } from "@trpc/server";
import { LuciaError } from "lucia";
import { DatabaseError } from "pg";
import { Auth, auth } from "../../auth/lucia";
import {
  AuthOutput,
  LoginInput,
  LogoutInput,
  RegisterInput,
  TRPCStatus,
} from "./types";

export interface AuthenticationController {
  register(input: RegisterInput): Promise<TRPCStatus<AuthOutput>>;
  login(input: LoginInput): Promise<TRPCStatus<AuthOutput>>;
  logout(input: LogoutInput): Promise<TRPCStatus<AuthOutput>>;
}

class LuciaAuthentication implements AuthenticationController {
  auth: Auth;
  constructor(auth: Auth) {
    this.auth = auth;
  }
  async register(
    registerInput: RegisterInput,
  ): Promise<TRPCStatus<AuthOutput>> {
    const { username, email, password } = registerInput;
    try {
      const user = await this.auth.createUser({
        userId: crypto.randomUUID(),
        key: {
          providerId: "email",
          providerUserId: email.toLowerCase(),
          password,
        },
        attributes: {
          username,
          email,
        },
      });

      const session = await this.auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = this.auth.createSessionCookie(session);

      sessionCookie.attributes.httpOnly = true;
      sessionCookie.attributes.sameSite = "none";
      sessionCookie.attributes.secure = true;

      const payload: AuthOutput = {
        user,
        sessionCookie: sessionCookie.serialize(),
      };
      return [null, payload] as const;
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.code === "23505") {
          if (e.detail?.includes("username")) {
            return [
              new TRPCError({
                code: "CONFLICT",
                message: "Username already used",
              }),
              null,
            ] as const;
          } else if (e.detail?.includes("email")) {
            return [
              new TRPCError({
                code: "CONFLICT",
                message: "Email already used",
              }),
              null,
            ] as const;
          } else {
            return [
              new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Somethings wrong with the db: " + JSON.stringify(e),
              }),
              null,
            ] as const;
          }
        }
      }
      return [
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not register new user: " + JSON.stringify(e),
        }),
        null,
      ] as const;
    }
  }
  async login(input: LoginInput): Promise<TRPCStatus<AuthOutput>> {
    const { email, password } = input;
    try {
      const key = await auth.useKey("email", email.toLowerCase(), password);
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);

      sessionCookie.attributes.httpOnly = true;
      sessionCookie.attributes.sameSite = "none";
      sessionCookie.attributes.secure = true;

      const user = await auth.getUser(key.userId);

      const payload: AuthOutput = {
        user,
        sessionCookie: sessionCookie.serialize(),
      };

      return [null, payload] as const;
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        return [
          new TRPCError({
            code: "BAD_REQUEST",
            message: "Incorrect email or password",
          }),
          null,
        ] as const;
      }
      return [
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not login user: " + JSON.stringify(e),
        }),
        null,
      ] as const;
    }
  }
  async logout(input: LogoutInput): Promise<TRPCStatus<AuthOutput>> {
    const authRequest = this.auth.handleRequest(
      input.opts.ctx.req,
      input.opts.ctx.res,
    );
    console.log(JSON.stringify(authRequest));

    const session = await authRequest.validate();

    console.log(session);

    if (!session) {
      return [new TRPCError({ code: "UNAUTHORIZED" }), null] as const;
    }
    await this.auth.invalidateSession(session.sessionId);

    const sessionCookie = auth.createSessionCookie(null);

    sessionCookie.attributes.httpOnly = true;
    sessionCookie.attributes.sameSite = "none";
    sessionCookie.attributes.secure = true;

    const payload: AuthOutput = {
      user: session.user,
      sessionCookie: sessionCookie.serialize(),
    };

    return [null, payload] as const;
  }
}

export const luciaAuthentication = new LuciaAuthentication(auth);
