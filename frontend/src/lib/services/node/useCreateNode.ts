import { Node as DatabaseNode } from "@backend/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { getQueryKey } from "@trpc/react-query";
import _ from "lodash";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";
import { Node as StoreNode } from "./nodeStore";

export type NodeCreationInput = RouterInput["node"]["create"];
export type NodeCreationOutput = RouterOutput["node"]["create"];

export default function useNodeCreate() {
  const queryClient = useQueryClient();

  const nodeCreator = rqTrpc.node.create.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(rqTrpc.node.getAllByMapId, undefined, "query"),
      });
    },
  });

  const createNode = async (params: { node: NodeCreationInput }) => {
    try {
      const newNode = await nodeCreator.mutateAsync(params.node);

      return [null, newNode] as const;
    } catch (e) {
      if (e instanceof TRPCClientError) return [e.message, null] as const;
      else
        return ["An Error has occured. Please try again:\n" + e, null] as const;
    }
  };
  return createNode;
}

export const databaseNodeToStoreNode = (input: DatabaseNode): StoreNode => {
  const node: StoreNode = {
    id: input.id,
    position: {
      x: input.xPosition,
      y: input.yPosition,
    },
    type: "node",
    data: _.pick(input, [
      "createdAt",
      "updatedAt",
      "mapId",
      "frontside",
      "backside",
      "parentNodeId",
      "nodeType",
    ]),
  };

  return node;
};
export const storeNodeToDatabaseNode = (input: StoreNode): DatabaseNode => {
  const node: DatabaseNode = {
    id: input.id,
    xPosition: input.position.x,
    yPosition: input.position.y,
    ..._.pick(input.data, [
      "createdAt",
      "updatedAt",
      "mapId",
      "frontside",
      "backside",
      "parentNodeId",
      "nodeType",
    ]),
  };
  return node;
};
