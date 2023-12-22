//import { TRPCError } from "@trpc/server";
//import bcrypt from "bcryptjs";
//import jwt from "jsonwebtoken";
//import * as schema from "../../db/schema";
//import env from "../../env";
//import { readUserById } from "../user/user.model";
//import { controlUserCreation } from "../user/userController";
//import * as loginModel from "./loginModels";
//import * as types from "./types";
//
//export async function controlLogin(credentials: types.LoginCredentials) {
//  const user = await loginModel.getLoginCredentials(credentials);
//  const pwdCorrect = await bcrypt.compare(credentials.password, user.password);
//  if (pwdCorrect) {
//    const accessToken = signAccessToken(user);
//    const refreshToken = signRefreshToken(user);
//    await loginModel.updateRefreshToken(refreshToken);
//    const tokens = {
//      access: accessToken,
//      refresh: refreshToken,
//    };
//    return [null, tokens];
//  }
//  return [new TRPCError({ code: "FORBIDDEN" }), null];
//}
//
//export async function controlRegistration(user: schema.NewUser) {
//  const [errorCheck, newUser] = await controlUserCreation(user);
//  if (errorCheck) {
//    return [errorCheck, null] as const;
//  }
//  const userCredentials = {
//    email: user.email,
//    password: user.password,
//    id: user.id!,
//  };
//  const accessToken = signAccessToken(userCredentials);
//  const refreshToken = signRefreshToken(userCredentials);
//  await loginModel.updateRefreshToken(refreshToken);
//  const res = {
//    user: newUser,
//    tokens: {
//      accessToken: accessToken,
//      refreshToken: refreshToken,
//    },
//  };
//  return [null, res] as const;
//}
//
//export function signAccessToken(user: types.LoginUser) {
//  const payload = {
//    userId: user.id,
//  };
//  const secret = env.ACCESS_TOKEN_SECRET;
//  const options = {
//    expiresIn: "84600s", //24h
//  };
//  const token = jwt.sign(payload, secret, options);
//  return token;
//}
//
//export function signRefreshToken(user: types.LoginUser) {
//  const payload = {
//    userId: user.id,
//  };
//  const secret = env.REFRESH_TOKEN_SECRET;
//  const options = {
//    expiresIn: "1y",
//  };
//  const token = jwt.sign(payload, secret, options);
//  return token;
//}
//
//export async function refreshAccessToken(token: types.refreshTokenInputType) {
//  jwt.verify(token.refreshToken, env.REFRESH_TOKEN_SECRET);
//  const decodedToken = jwt.decode(token.refreshToken) as types.JWTPayload;
//  const tokensUserId = decodedToken.userId;
//  const [errorCheck, user] = await readUserById(tokensUserId);
//  if (errorCheck) {
//    return [errorCheck, null];
//  }
//  if (user) {
//    const logInUser = {
//      id: user.id,
//      password: user.password,
//    };
//    if (user && user.refresh_token === token.refreshToken) {
//      const newAccessToken = signAccessToken(logInUser);
//      return {
//        newAccessToken,
//      };
//    }
//  }
//}
