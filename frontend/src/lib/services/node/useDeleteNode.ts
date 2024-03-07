import { useQueryClient } from "@tanstack/react-query";
import { TRPCClientError, getQueryKey } from "@trpc/react-query";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";

export type nodeId = RouterInput["node"]["deleteWithAllChildren"];
export type NodeDeleteOutput = RouterOutput["node"]["deleteWithAllChildren"];

export default function useNodeDelete() {
  const queryClient = useQueryClient();

  const nodeDeletor = rqTrpc.node.deleteWithAllChildren.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(rqTrpc.node.getAllByMapId, undefined, "query"),
      });
    },
  });

  const deleteNode = async (params: { node: nodeId }) => {
    try {
      const deletedNode = await nodeDeletor.mutateAsync(params.node);

      return [null, deletedNode] as const;
    } catch (e) {
      if (e instanceof TRPCClientError) return [e.message, null] as const;
      else
        return ["An Error has occured. Please try again:\n" + e, null] as const;
    }
  };
  return deleteNode;
}
