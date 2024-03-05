import { Node } from "@/lib/services/node/nodeStore";
import useNodeCreate from "@/lib/services/node/useCreateNode";
import { useCallback } from "react";

export function useAddNewNodeToMap(
  topLevelStack: Node | undefined,
  mapId: string,
) {
  const createNode = useNodeCreate();

  const addNode = useCallback(async () => {
    await createNode({
      node: {
        mapId: mapId,
        frontside: "",
        backside: "",
        xPosition: topLevelStack ? topLevelStack.position.x + 350 : 500,
        yPosition: topLevelStack?.position.y || 500,
        nodeType: "stack",
      },
    });
  }, [createNode]);

  return addNode;
}
