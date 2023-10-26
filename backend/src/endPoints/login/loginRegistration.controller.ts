import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as schema from "../../db/schema";
import env from "../../env";
import { readUserById } from "../user/user.model";
import { controlUserCreation } from "../user/userController";
import {
  LoginRegistrationModel,
  loginRegistrationModelDB,
} from "./loginRegistration.model";
import * as types from "./types";

type TokenStatus = readonly [
  null | TRPCError,
  {
    accessToken: string;
    refreshToken: string;
  } | null,
];

type RegistrationStatus = readonly [
  null | TRPCError,
  {
    newUser: schema.NewUser;
    accessToken: string;
  } | null,
];

type RefreshTokenStatus = readonly [
  null | TRPCError,
  {
    accessToken: string
  } | null,
];

interface LoginRegistrationController {
  login: (credentials: types.LoginCredentials) => Promise<TokenStatus>;
  registration: (user: schema.NewUser) => Promise<RegistrationStatus>;
  refreshAccessToken: (refreshToken: string) => Promise<RefreshTokenStatus>;
}

class UserLoginRegistrationController implements LoginRegistrationController {
  loginRegistrationModel: LoginRegistrationModel;
  constructor(loginRegistrationModel: LoginRegistrationModel) {
    this.loginRegistrationModel = loginRegistrationModel;
  }
  async login(credentials: types.LoginCredentials): Promise<TokenStatus> {
    const user =
      await this.loginRegistrationModel.checkLoginCredentials(credentials);
    const pwdCorrect = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (pwdCorrect) {
      const accessToken = this.signAccessToken(user);
      const refreshToken = this.signRefreshToken(user);
      await loginRegistrationModelDB.updateRefreshToken(refreshToken);
      const tokens = {
        accessToken,
        refreshToken,
      };

      return [null, tokens] as const;
    }

    return [new TRPCError({ code: "UNAUTHORIZED" }), null] as const;
  }

  async registration(user: schema.NewUser): Promise<RegistrationStatus> {
    const result = await controlUserCreation(user);
    if (result[0]) return result;

    const newUser = result[1];

    const userCredentials = {
      email: newUser.email,
      password: newUser.password,
      user_id: newUser.user_id!,
    };

    const accessToken = this.signAccessToken(userCredentials);
    const refreshToken = this.signRefreshToken(userCredentials);
    await this.loginRegistrationModel.updateRefreshToken(refreshToken);

    newUser.refresh_token = refreshToken;

    return [
      null,
      {
        newUser,
        accessToken
      }
    ] as const;
  }

  async refreshAccessToken(token: types.refreshTokenInputType) {
    jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    const decodedToken = jwt.decode(token) as types.JWTPayload;
    const tokensUserId = decodedToken.userId;
    const user = await readUserById(tokensUserId);
    const logInUser = {
      user_id: user[0].user_id,
      password: user[0].password,
    };
    if (user && user[0].refresh_token === token) {
      const accessToken = this.signAccessToken(logInUser);
      return [null, {
        accessToken,
      }] as const;
    }
    return [new TRPCError({code: "FORBIDDEN"}), null] as const;
  }

  private signAccessToken(user: types.LoginUser) {
    const payload = {
      userId: user.user_id,
    };
    const secret = env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "84600s", //24h
    };
    const token = jwt.sign(payload, secret, options);
    return token;
  }

  private signRefreshToken(user: types.LoginUser) {
    const payload = {
      userId: user.user_id,
    };
    const secret = env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
  }

}

export const loginRegistrationController = new UserLoginRegistrationController(
  loginRegistrationModelDB,
);
