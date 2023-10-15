import * as schema from "../../db/schema";
import * as types from "./types";
import * as userModel from "./user.model";
import bcrypt from "bcryptjs";
import { TRPCError } from "trpc";

export async function controlUserCreation(userInput: schema.NewUser) {
  const userExists = await userModel.checkCredentials(
    userInput.email,
    userInput.username
  );

  if (userExists[0]) return userExists[0];

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(userInput.password, salt);
  const res = await userModel.writeUser(userInput, hashedPwd);
  return res[0];
}

export async function getAllUsers() {
  const res = await userModel.readAllUsers();
  return res;
}

export async function getUserById(userId: string) {
  const res = await userModel.readUserById(userId);
  return res;
}

export async function controlUserUpdateById(userInput: schema.User) {
  const updateCredentials = await userModel.fetchUpdateCredentials(userInput);
  checkUpdateCredentials(updateCredentials, userInput);
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(userInput.password, salt);
  const res = await userModel.updateUserById(userInput, hashedPwd);
  return res;
}

function checkUpdateCredentials(
  fetchedUser: schema.User[],
  userInput: schema.User
) {
  for (let i = 0; i < fetchedUser.length; i++) {
    if (
      fetchedUser[i].email === userInput.email &&
      fetchedUser[i].username === userInput.username
    ) {
      throw new TRPCError(403, { message: "USERNAME AND EMAIL ALREADY EXIST" });
    } else if (fetchedUser[i].email === userInput.email) {
      throw new TRPCError(403, { message: "EMAIL ALREADY EXISTS" });
    } else if (fetchedUser[i].username === userInput.username) {
      throw new TRPCError(403, { message: "USERNAME ALREADY EXISTS" });
    }
  }
}

export async function controlUserDeletionById(userId: string) {
  const res = await userModel.deleteUserById(userId);
  return res;
}
