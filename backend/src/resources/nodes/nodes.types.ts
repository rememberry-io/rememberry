import z from "zod";

export const newNodeInput = z.object({
  id: z.string().optional(),
  mapId: z.string(),
  frontside: z.string(),
  backside: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  parentNodeId: z.string().optional(),
  nodeType: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const stackInput = z.object({
  id: z.string(),
  mapId: z.string(),
  frontside: z.string(),
  backside: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  parentNodeId: z.string().nullable(),
  nodeType: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const changeParentStackInput = z.object({
  childId: z.string(),
  parentId: z.string(),
});
