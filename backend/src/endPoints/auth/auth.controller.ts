import { Lucia, Scrypt, User } from "lucia";
import { lucia } from "../../auth/lucia";
import { User as DBUser } from "../../db/schema";
import { TRPCStatus, getTRPCError } from "../../utils";
import { UserController, userController } from "../user/user.controller";
import { AuthOutput, LoginInput, LogoutInput, RegisterInput } from "./types";

export interface AuthenticationController {
  register(input: RegisterInput): Promise<TRPCStatus<AuthOutput>>;
  login(input: LoginInput): Promise<TRPCStatus<AuthOutput>>;
  logout(input: LogoutInput): Promise<TRPCStatus<AuthWithoutUser>>;
}

class LuciaAuthentication implements AuthenticationController {
  userController: UserController;
  luciaAuth: Lucia;
  constructor(userController: UserController, luciaAuth: Lucia) {
    this.userController = userController;
    this.luciaAuth = luciaAuth;
  }
  async register(registerInput: RegisterInput) {
    const [err, user] = await this.userController.createUser(registerInput);

    if (err) return getTRPCError(err.message, err.code);

    return this.createSessionAndCookie(user);
  }
  async login(input: LoginInput) {
    const { email, password } = input;
    try {
      const [err, user] = await this.userController.getUserByEmail(email);
      if (err) return getTRPCError(err.message, err.code);

      const validPw = await new Scrypt().verify(user.password, password);
      if (!validPw)
        return getTRPCError("Invalid Username or password", "BAD_REQUEST");

      return this.createSessionAndCookie(user);
    } catch (e) {
      return getTRPCError(
        "Could not log in: " + JSON.stringify(e),
        "INTERNAL_SERVER_ERROR",
      );
    }
  }
  async logout(input: LogoutInput) {
    const { req } = input.opts.ctx;

    const cookieHeader = req.headers.cookie;

    const sessionId = this.luciaAuth.readSessionCookie(cookieHeader ?? "");
    if (!sessionId) return getTRPCError("Invalid cookie", "UNAUTHORIZED");

    try {
      await this.luciaAuth.invalidateSession(sessionId);
    } catch (e) {
      return getTRPCError(
        "Could not invalidate Session",
        "INTERNAL_SERVER_ERROR",
      );
    }

    const sessionCookie = this.luciaAuth.createBlankSessionCookie();

    const payload: AuthWithoutUser = {
      sessionCookie: sessionCookie.serialize(),
    };

    return [null, payload] as const;
  }
  private async createSessionAndCookie(userIn: DBUser) {
    try {
      const session = await this.luciaAuth.createSession(userIn.id, {});

      const sessionCookie = this.luciaAuth.createSessionCookie(session.id);

      const user: User = {
        id: userIn.id,
        email: userIn.email,
        username: userIn.username,
      };

      const payload: AuthOutput = {
        user,
        sessionCookie: sessionCookie.serialize(),
      };
      return [null, payload] as const;
    } catch (e) {
      return getTRPCError(
        "Could not create session" + JSON.stringify(e),
        "INTERNAL_SERVER_ERROR",
      );
    }
  }
}

type AuthWithoutUser = Omit<AuthOutput, "user">;

export const luciaAuthentication = new LuciaAuthentication(
  userController,
  lucia,
);
