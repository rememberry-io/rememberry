import bcrypt from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import * as schema from "../../db/schema";
import { readUserById } from "../user/user.model";
import { controlUserCreation } from "../user/userController";
import * as loginModel from "./loginModels";
import * as types from "./types";
config();

export async function controlLogin(credentials: types.LoginCredentials) {
  const user = await loginModel.checkLoginCredentials(credentials);
  const pwdCorrect = await bcrypt.compare(credentials.password, user.password);
  if (pwdCorrect) {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await loginModel.updateRefreshToken(refreshToken);
    const tokens = {
      access: accessToken,
      refresh: refreshToken,
    };
    return tokens;
  }
  return { message: "UNAUTHORIZED" };
}

export async function controlRegistration(user: schema.NewUser) {
  const newUser = await controlUserCreation(user);
  const userCredentials = {
    email: user.email,
    password: user.password,
    user_id: user.user_id!,
  };
  const accessToken = signAccessToken(userCredentials);
  const refreshToken = signRefreshToken(userCredentials);
  await loginModel.updateRefreshToken(refreshToken);
  const res = {
    user: newUser,
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
  return res;
}

export function signAccessToken(user: types.LoginUser) {
  const payload = {
    userId: user.user_id,
  };
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const options = {
    expiresIn: "84600s", //24h
  };
  const token = jwt.sign(payload, secret, options);
  return token;
}

export function signRefreshToken(user: types.LoginUser) {
  const payload = {
    userId: user.user_id,
  };
  const secret = process.env.REFRESH_TOKEN_SECRET!;
  const options = {
    expiresIn: "1y",
  };
  const token = jwt.sign(payload, secret, options);
  return token;
}

export async function refreshAccessToken(token: types.refreshTokenInputType) {
  jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  const decodedToken = jwt.decode(token.refreshToken) as types.JWTPayload;
  const tokensUserId = decodedToken.userId;
  const user = await readUserById(tokensUserId);
  const logInUser = {
    user_id: user[0].user_id,
    password: user[0].password,
  };
  if (user && user[0].refresh_token === token.refreshToken) {
    const newAccessToken = signAccessToken(logInUser);
    return {
      newAccessToken,
    };
  }
}
