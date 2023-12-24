import { TRPCClientError } from "@trpc/client";
import { useUserStore } from "../_stores/userStore";
import { RouterInput, RouterOutput, rqTrpc } from "../_trpc/client";

export type RegisterUserInput = RouterInput["auth"]["register"];
export type RegisterUserOutput = RouterOutput["auth"]["register"];

export default function useRegisterUser() {
  const userCreator = rqTrpc.auth.register.useMutation();
  const userStore = useUserStore();
  const registerUser = async (params: { user: RegisterUserInput }) => {
    try {
      const newUser = await userCreator.mutateAsync(params.user);

      userStore.actions.setUser(newUser);
    } catch (error) {
      if (error instanceof TRPCClientError) console.error(error);
      else console.error(error);
    }
  };
  return registerUser;
}
