import { TRPCClientError } from "@trpc/client";
import { RouterInput, RouterOutput, rqTrpc } from "../_trpc/client";
import { useUserStore } from "./userStore";
import { useEffect } from "react";

export type GetUserInput = RouterInput["user"]["getUserBySession"];
export type GetUserOutput = RouterOutput["user"]["getUserBySession"];

export default function useGetUser() {
  const user = rqTrpc.user.getUserBySession.useQuery(undefined, { retry: false });
  const userStore = useUserStore();

  useEffect(() => {
    userStore.actions.setLoading(user.isLoading)
  }, [user.isLoading])

  const saveUserData = async () => {
    try {
      if (!user.data) {
        throw new Error("Hurensohn")
      }
      console.log("test")
      userStore.actions.setUser(user.data);
      userStore.actions.setLoggedIn(true);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        userStore.actions.setLoggedIn(false);
        userStore.actions.deleteUser()
      } else console.error(error);
    }
  };

  return { user: user.data, isLoading: user.isLoading, saveUserData };
}
