import { Lucia, Scrypt, User as luciaUser } from "lucia";
import { lucia } from "../../auth/lucia";
import { NewUser, User } from "../../db/schema";
import { getTRPCError } from "../../utils";
import { TRPCStatus } from "../auth/types";
import { GetUserBySessionInput } from "./types";
import { UserModel, userModelDrizzle } from "./user.model";

export interface UserController {
  createUser(input: NewUser): Promise<TRPCStatus<User>>;
  getUserByEmail(email: string): Promise<TRPCStatus<User>>;
  getUserBySession(
    input: GetUserBySessionInput,
  ): Promise<TRPCStatus<luciaUser>>;
  updateUserById(input: User): Promise<TRPCStatus<luciaUser>>;
  deleteUserById(userId: string): Promise<TRPCStatus<string>>;
}

class LuciaUserController implements UserController {
  userModel: UserModel;
  luciaAuth: Lucia;
  constructor(userModel: UserModel, luciaAuth: Lucia) {
    this.userModel = userModel;
    this.luciaAuth = luciaAuth;
  }
  async createUser(input: NewUser): Promise<TRPCStatus<User>> {
    try {
      const userAtrributes = {
        username: input.username,
        email: input.email,
        password: await new Scrypt().hash(input.password),
      };

      const [err, user] = await this.userModel.createUser(userAtrributes);

      if (err) return [err, null] as const;

      return [null, user] as const;
    } catch (e) {
      return getTRPCError();
    }
  }
  async getUserByEmail(email: string): Promise<TRPCStatus<User>> {
    const [err, user] = await this.userModel.getUserByEmail(email);
    if (err) return getTRPCError(err.message, err.code);
    return [null, user] as const;
  }
  async getUserBySession(input: GetUserBySessionInput) {
    const cookieHeader = input.req.headers.cookie;
    if (!cookieHeader) return getTRPCError("No cookie");
    const sessionId = this.luciaAuth.readSessionCookie(cookieHeader);
    if (!sessionId) return getTRPCError("Could not read session");

    const { session, user } = await this.luciaAuth.validateSession(sessionId);

    if (!session) return getTRPCError("Session is invalid");

    return [null, user] as const;
  }
  async updateUserById(input: User) {
    try {
      const [err, user] = await this.userModel.updateUserById(input);
      if (err) return getTRPCError(err.message, err.code);
      return [null, user] as const;
    } catch (e) {
      return getTRPCError("Could not update User");
    }
  }
  //TODO: unvalidate all session (and send a new session so user stays logged in)
  async deleteUserById(userId: string) {
    const [err, _] = await this.userModel.deleteUserById(userId);
    if (err) return getTRPCError(err.message, err.code);
    return [null, "Successfully deleted user"] as const;
  }
}

export const userController = new LuciaUserController(userModelDrizzle, lucia);
