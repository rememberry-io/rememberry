import { Scrypt, User } from "lucia";
import { LuciaAuth, lucia } from "../../auth/lucia";
import { User as DBUser } from "../../db/schema";
import { Logger, ScopedLogger } from "../../logger";
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
  luciaAuth: LuciaAuth;
  logger: Logger;
  constructor(userController: UserController, luciaAuth: LuciaAuth) {
    this.userController = userController;
    this.luciaAuth = luciaAuth;
    this.logger = new ScopedLogger("Authentication Controller");
  }
  async register(registerInput: RegisterInput) {
    const [err, user] = await this.userController.createUser(registerInput);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    this.logger.info("New user registered: " + user.id + " " + user.username);

    return this.createSessionAndCookie(user);
  }
  async login(input: LoginInput) {
    const { email, password } = input;
    try {
      const [err, user] = await this.userController.getUserByEmail(email);
      if (err) return getTRPCError(this.logger, err.message, err.code);

      const validPw = await new Scrypt().verify(user.password, password);
      if (!validPw)
        return getTRPCError(
          this.logger,
          "Invalid Username or password",
          "BAD_REQUEST",
        );

      this.logger.info("User has logged in: " + user.id + " " + user.username);

      return this.createSessionAndCookie(user);
    } catch (e) {
      return getTRPCError(
        this.logger,
        "Could not log in: " + JSON.stringify(e),
        "INTERNAL_SERVER_ERROR",
      );
    }
  }
  async logout(input: LogoutInput) {
    const { req } = input.opts.ctx;

    const cookieHeader = req.headers.cookie;

    const sessionId = this.luciaAuth.lucia.readSessionCookie(
      cookieHeader ?? "",
    );
    if (!sessionId)
      return getTRPCError(this.logger, "Invalid cookie", "UNAUTHORIZED");

    try {
      await this.luciaAuth.lucia.invalidateSession(sessionId);
    } catch (e) {
      return getTRPCError(
        this.logger,
        "Could not invalidate Session",
        "INTERNAL_SERVER_ERROR",
      );
    }

    const sessionCookie = this.luciaAuth.lucia.createBlankSessionCookie();

    const payload: AuthWithoutUser = {
      sessionCookie: sessionCookie.serialize(),
    };

    this.logger.info("User has logged out");

    return [null, payload] as const;
  }
  private async createSessionAndCookie(userIn: DBUser) {
    try {
      const session = await this.luciaAuth.lucia.createSession(userIn.id, {});

      const sessionCookie = this.luciaAuth.lucia.createSessionCookie(
        session.id,
      );

      const user: User = {
        id: userIn.id,
        email: userIn.email,
        username: userIn.username,
      };

      const payload: AuthOutput = {
        user,
        sessionCookie: sessionCookie.serialize(),
      };
      this.logger.info(
        "Session was created for: ",
        user.id + " ",
        user.username,
      );
      return [null, payload] as const;
    } catch (e) {
      const error = e as Error
      return getTRPCError(
        this.logger,
        "Could not create session" + JSON.stringify(error.message),
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
