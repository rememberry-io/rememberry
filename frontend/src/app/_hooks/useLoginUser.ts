import { TRPCClientError } from "@trpc/client";
import { useUserStore } from "../_stores/userStore";
import { RouterInput, RouterOutput, rqTrpc } from "../_trpc/client";

export type LoginUserInput = RouterInput["auth"]["login"];
export type LoginUserOutput = RouterOutput["auth"]["login"];

export default function useLoginUser() {
  const userCreator = rqTrpc.auth.login.useMutation();
  const userStore = useUserStore();
  const loginUser = async (params: { user: LoginUserInput }) => {
    try {
      const user = await userCreator.mutateAsync(params.user);

      userStore.actions.setUser(user);
    } catch (error) {
      if (error instanceof TRPCClientError) console.error(error);
      else console.error(error);
    }
  };
  return loginUser;
}
