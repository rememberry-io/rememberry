import { useUserStore } from "../authentication/userStore";
import { rqTrpc } from "../trpc/client";

export type Map = {
  id: string;
  userId: string;
  peerId: string | null;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function useGetMapByUserId() {
  const userId = useUserStore((state) => {
    if (state.user) return state.user.id;
    return null;
  });

  if (!userId) {
    return {
      isLoading: false,
      error: new Error("dongs"),
      isError: true,
      maps: [],
    };
  }

  const maps = rqTrpc.maps.getUsersMaps.useQuery(userId);

  return {
    isLoading: maps.isLoading,
    error: maps.error,
    isError: maps.isError,
    maps: maps.data as Map[],
  };
}
