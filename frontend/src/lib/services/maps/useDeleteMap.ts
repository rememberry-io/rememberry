//export type MapInput = RouterInput["maps"]["createMap"];
//export type MapOutput = RouterOutput["maps"]["createMap"];
//
//export default function useCreateMap() {
//  const queryClient = useQueryClient();
//  const mapCreator = rqTrpc.maps.createMap.useMutation({
//    onSuccess() {
//      queryClient.refetchQueries({
//        queryKey: getQueryKey(rqTrpc.maps.getUsersMaps, undefined, "query"),
//      });
//    },
//  });
//
//  const createMap = async (params: { map: MapInput }) => {
//    try {
//      const newMap = await mapCreator.mutateAsync(params.map);
//
//      return [null, newMap] as const;
//    } catch (e) {
//      if (e instanceof TRPCClientError) return [e.message, null] as const;
//      else
//        return [
//          "An Error has occured. Please try again: \n" + e,
//          null,
//        ] as const;
//    }
//  };
//
//  return createMap;
//}
