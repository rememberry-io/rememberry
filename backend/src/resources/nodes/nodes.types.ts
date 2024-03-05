import z from "zod";
import { NewNode, Node } from "../../db/schema";

export const nodeType = z.enum(["stack", "flashcard"]);

export const newNodeInput: z.ZodType<NewNode> = z.object({
  id: z.string().optional(),
  mapId: z.string(),
  frontside: z.string(),
  backside: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  parentNodeId: z.string().optional(),
  nodeType: nodeType,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const nodeInput: z.ZodType<Node> = z.object({
  id: z.string(),
  mapId: z.string(),
  frontside: z.string(),
  backside: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  parentNodeId: z.string().nullable(),
  nodeType: nodeType,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const changeParentNodeInput = z.object({
  childId: z.string(),
  parentId: z.string(),
});
