import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import * as schema from "../../db/schema";
import { UserStatus } from "./types";
import { UserModel, userModelDB } from "./user.model";

type credStatus = readonly [TRPCError, null] | readonly [null, boolean];

export interface UserControllerInterface {
  createUser: (input: schema.NewUser) => Promise<UserStatus>;
  getAllUsers: () => Promise<schema.User[]>;
  getUserById: (userId: string) => Promise<UserStatus>;
  updateUserById: (
    userId: string,
    userInput: schema.User,
  ) => Promise<UserStatus>;
  deleteUserById: (userId: string) => Promise<UserStatus>;
  checkCredentials: (email: string, username: string) => Promise<credStatus>;
}

class UserController implements UserControllerInterface {
  private userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }
  async createUser(userInput: schema.NewUser) {
    const [errorCheck, _userExists] = await this.checkCredentials(
      userInput.email,
      userInput.username,
    );

    if (errorCheck) return [errorCheck, null] as const;

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(userInput.password, salt);
    const [errorCreate, createdUser] = await this.userModel.createUser(
      userInput,
      hashedPwd,
    );
    if (errorCreate) return [errorCreate, null] as const;
    return [null, createdUser] as const;
  }
  async getAllUsers() {
    const res = await this.userModel.getAllUsers();
    return res;
  }

  async getUserById(userId: string) {
    const [error, user] = await this.userModel.getUserById(userId);
    if (error) return [error, null] as const;
    return [null, user] as const;
  }

  async updateUserById(userId: string, userInput: schema.User) {
    const [errorCheck, _userExists] = await this.checkCredentials(
      userInput.email,
      userInput.username,
    );
    if (errorCheck) return [errorCheck, null] as const;

    const [errorGetUser, _user] = await this.getUserById(userId);
    if (errorGetUser) return [errorGetUser, null] as const;

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(userInput.password, salt);
    const [errorUpdate, updatedUser] = await this.userModel.updateUserById(
      userId,
      userInput,
      hashedPwd,
    );

    if (errorUpdate) return [errorUpdate, null] as const;
    return [null, updatedUser] as const;
  }

  async deleteUserById(userId: string) {
    const [errorDelete, deletedUser] =
      await this.userModel.deleteUserById(userId);
    if (errorDelete) return [errorDelete, null] as const;
    return [null, deletedUser] as const;
  }

  async checkCredentials(email: string, username: string): Promise<credStatus> {
    if (
      (await this.userModel.checkUserEmail(email)) &&
      (await this.userModel.checkUsername(username))
    ) {
      return [
        new TRPCError({
          code: "FORBIDDEN",
          message: "USERNAME AND EMAIL ALREADY EXIST",
        }),
        null,
      ] as const;
    } else if (await this.userModel.checkUserEmail(email)) {
      return [
        new TRPCError({ code: "FORBIDDEN", message: "EMAIL ALREADY EXISTS" }),
        null,
      ] as const;
    } else if (await this.userModel.checkUsername(username)) {
      return [
        new TRPCError({
          code: "FORBIDDEN",
          message: "USERNAME ALREADY EXISTS",
        }),
        null,
      ] as const;
    }
    return [null, true] as const;
  }
}

export const userController = new UserController(userModelDB);
