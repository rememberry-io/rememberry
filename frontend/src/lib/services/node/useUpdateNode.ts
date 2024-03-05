import { useQueryClient } from "@tanstack/react-query";
import { TRPCClientError, getQueryKey } from "@trpc/react-query";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";

export type NodeUpdateInput = RouterInput["node"]["updateById"];
export type NodeUpdateOutput = RouterOutput["node"]["updateById"];

export default function useNodeUpdate() {
  const queryClient = useQueryClient();

  const nodeUpdater = rqTrpc.node.updateById.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(rqTrpc.node.getAllByMapId, undefined, "query"),
      });
    },
  });

  const updatedNode = async (params: { node: NodeUpdateInput }) => {
    try {
      const updatedNode = await nodeUpdater.mutateAsync(params.node);

      return [null, updatedNode] as const;
    } catch (e) {
      if (e instanceof TRPCClientError) return [e.message, null] as const;
      else
        return ["An Error has occured. Please try again:\n" + e, null] as const;
    }
  };
  return updatedNode;
}
