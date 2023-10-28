import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as schema from "../../db/schema";
import env from "../../env";
import { UserLoginCredentials } from "../user/types";
import {
  UserControllerInterface,
  userController,
} from "../user/user.controller";
import { UserModel, userModelDB } from "../user/user.model";
import * as types from "./types";

type JWTPayload = {
  userId: string;
  email: string;
  password: string;
};

type TokenStatus =
  | readonly [TRPCError, null]
  | readonly [
      null,
      {
        user: schema.User;
        accessToken: string;
        refreshToken: string;
      },
    ];

interface AuthenticationController {
  login: (credentials: UserLoginCredentials) => Promise<TokenStatus>;
  registration: (user: schema.NewUser) => Promise<TokenStatus>;
  refreshAccessToken: (refreshToken: string) => Promise<TokenStatus>;
}

class UserAuthenticationController implements AuthenticationController {
  private userController: UserControllerInterface;
  private userModel: UserModel;

  constructor(userController: UserControllerInterface, userModel: UserModel) {
    this.userController = userController;
    this.userModel = userModel;
  }
  async login(credentials: UserLoginCredentials): Promise<TokenStatus> {
    const [errorGetUserId, fetchedUserId] =
      await this.userModel.getUserIdAndPwByEmail(credentials.email);
    if (errorGetUserId) return [errorGetUserId, null] as const;
    const { userId, password } = fetchedUserId;

    const [errorGetUser, fetchedUser] =
      await this.userController.getUserById(userId);
    if (errorGetUser) return [errorGetUser, null] as const;
    const { email } = fetchedUser;

    const pwdCorrect = await bcrypt.compare(credentials.password, password);
    if (!pwdCorrect)
      return [new TRPCError({ code: "UNAUTHORIZED" }), null] as const;

    const payload: JWTPayload = {
      userId,
      email,
      password,
    };

    return await this.getUserAndTokensByPayload(payload);
  }

  async registration(newUser: schema.NewUser) {
    const [errorCreate, createdUser] =
      await this.userController.createUser(newUser);
    if (errorCreate) {
      const dangs = [errorCreate, null] as const;
      return dangs;
    }
    const { email, password, user_id } = createdUser;

    const payload: JWTPayload = {
      userId: user_id,
      email,
      password,
    };

    return await this.getUserAndTokensByPayload(payload);
  }

  async refreshAccessToken(token: types.refreshTokenInputType) {
    try {
      jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      console.error(error);
      return [new TRPCError({ code: "UNAUTHORIZED" }), null] as const;
    }

    const decodedToken = jwt.decode(token) as types.JWTPayload;
    const userId = decodedToken.userId;

    const user = await this.userModel.getUserById(userId);
    if (user[0]) return user;
    const { user_id, email, password, refresh_token } = user[1];
    const refreshToken = refresh_token;

    const payload: JWTPayload = {
      userId: user_id,
      email,
      password,
    };

    if (refreshToken === token) {
      const accessToken = this.signAccessToken(payload);
      return [
        null,
        {
          user: user[1],
          refreshToken,
          accessToken,
        },
      ] as const;
    }
    return [new TRPCError({ code: "FORBIDDEN" }), null] as const;
  }

  private signAccessToken(payload: JWTPayload) {
    const secret = env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "84600s", //24h
    };
    const token = jwt.sign(payload, secret, options);
    return token;
  }

  private signRefreshToken(payload: JWTPayload) {
    const secret = env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
  }
  private async getUserAndTokensByPayload(payload: JWTPayload) {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    const [errorUpdate, updatedUser] =
      await this.userModel.updateUserRefreshToken(refreshToken);
    if (errorUpdate) return [errorUpdate, null] as const;

    const res = {
      user: updatedUser,
      refreshToken,
      accessToken,
    };

    return [null, res] as const;
  }
}

export const authenticationController = new UserAuthenticationController(
  userController,
  userModelDB,
);
