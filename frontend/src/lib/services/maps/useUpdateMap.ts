import { useQueryClient } from "@tanstack/react-query";
import { MapUpdateInput, mapRouter } from "./map.types";
import { getQueryKey } from "@trpc/react-query";
import { backendHookWrapper } from "@/lib/utils";

export default function useUpdateMap() {
  const queryClient = useQueryClient();
  const mapUpdater = mapRouter.updateMap.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(mapRouter.getUsersMaps, undefined, "query"),
      });
    },
  });

  const updateMap = async (map: MapUpdateInput) => {
    return await backendHookWrapper(map, mapUpdater.mutateAsync)
  }

  return updateMap;
}
