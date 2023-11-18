import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import * as schema from "../../db/schema";
import * as userModel from "./user.model";

export async function controlUserCreation(userInput: schema.NewUser) {
  const [error, unUsed] = await userModel.checkCredentials(
    userInput.email,
    userInput.username,
  );

  if (error) return [error, null];
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(userInput.password, salt);
  const [errorCheck, res] = await userModel.writeUser(userInput, hashedPwd);
  if (errorCheck) {
    return [errorCheck, null];
  } else {
    return [null, res];
  }
}

export async function getAllUsers() {
  const [errorCheck, res] = await userModel.readAllUsers();
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function getUserById(userId: string) {
  const [errorCheck, res] = await userModel.readUserById(userId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function controlUserUpdateById(
  newPassword: string,
  userEmail: string,
  username: string,
  userId: string,
) {
  const updateCredentials = await userModel.fetchUpdateCredentials(
    userEmail,
    username,
    userId,
  );
  const [errorCheck, unUsed] = checkUpdateCredentials(
    updateCredentials,
    userEmail,
    username,
  );
  if (errorCheck) {
    return [errorCheck, null];
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(newPassword, salt);
  const [error, res] = await userModel.updateUserById(
    username,
    userEmail,
    userId,
    hashedPwd,
  );
  if (error) {
    return [error, null];
  }
  return [null, res];
}

function checkUpdateCredentials(
  fetchedUser: schema.User[],
  userEmail: string,
  username: string,
) {
  for (let i = 0; i < fetchedUser.length; i++) {
    if (
      fetchedUser[i].email === userEmail &&
      fetchedUser[i].username === username
    ) {
      return [
        new TRPCError({
          code: "FORBIDDEN",
          message: "USERNAME AND EMAIL ALREADY EXIST",
        }),
        null,
      ];
    } else if (fetchedUser[i].email === userEmail) {
      return [
        new TRPCError({
          code: "FORBIDDEN",
          message: "EMAIL ALREADY EXISTS",
        }),
        null,
      ];
    } else if (fetchedUser[i].username === username) {
      return [
        new TRPCError({
          code: "FORBIDDEN",
          message: "USERNAME ALREADY EXISTS",
        }),
        null,
      ];
    }
  }
  return [null, true];
}

export async function controlUserDeletionById(userId: string) {
  const [errorCheck, res] = await userModel.deleteUserById(userId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}
