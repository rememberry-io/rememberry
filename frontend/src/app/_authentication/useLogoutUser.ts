import { TRPCClientError } from "@trpc/client";
import { rqTrpc } from "../_trpc/client";
import { useUserStore } from "./userStore";

export default function useLogoutUser() {
  const userCreator = rqTrpc.auth.logout.useMutation();
  const userStore = useUserStore();
  const logoutUser = async () => {
    try {
      await userCreator.mutateAsync();

      userStore.actions.deleteUser();
    } catch (error) {
      if (error instanceof TRPCClientError) console.error(error);
      else console.error(error);
    }
  };
  return logoutUser;
}
