import { rqTrpc } from "../trpc/client";

export default function useGetNodesByMapId(mapId: string) {
  const nodes = rqTrpc.node.getAllByMapId.useQuery(mapId);

  return nodes;
}
