import { Node as DatabaseNode } from "@backend/db/schema";
import _ from "lodash";
import { rqTrpc } from "../trpc/client";
import { Node as StoreNode } from "./node.types";

export const nodeRouter = rqTrpc.node;

export const databaseNodeToStoreNode = (input: DatabaseNode): StoreNode => {
  const node: StoreNode = {
    id: input.id,
    position: {
      x: input.xPosition,
      y: input.yPosition,
    },
    type: "node",
    data: {
      ..._.pick(input, [
        "createdAt",
        "updatedAt",
        "mapId",
        "frontside",
        "backside",
        "parentNodeId",
        "nodeType",
      ]),
      editNode(_nodeId) {
        console.info("Should be overwritten in map page");
      },
      deleteNode(_input) {
        console.info("Should be overwritten in map page");
        return new Promise((resolve, _reject) => {
          resolve("Should be overwritten with actual logic");
        });
      },
    },
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
