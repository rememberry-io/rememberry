import { TRPCClientError } from "@trpc/client";
import { useUserStore } from "../_stores/userStore";
import { rqTrpc } from "../_trpc/client";

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
