import { useQueryClient } from "@tanstack/react-query";
import { RouterInput, RouterOutput, tClient } from "../_trpc/client";

interface UserModel {
  create: RouterInput["user"]["createUser"];
  update: RouterInput["user"]["updateUser"];
  delete: RouterInput["user"]["updateUser"];
}

export type test = RouterInput["user"];

export type UserCreate = RouterInput["user"]["createUser"];
export type UserUpdate = RouterInput["user"]["createUser"];
export type UserCreateOut = RouterOutput["user"]["createUser"];

export default function useCreateUser() {
  const client = tClient;
  const queryClient = useQueryClient();
  //   const userStore = useUserStore();
}
class UserHooks {
  constructor() {}
  async createUser(userData: UserCreate) {
    try {
      const user = await tClient.client.user.createUser.query(userData);
      console.log(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const userHooks = new UserHooks();
