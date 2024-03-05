import { Node as NodeType } from "@backend/db/schema";
import { Node as ReactFlowNode } from "reactflow";

export type NodeData = Omit<NodeType, "id" | "xPosition" | "yPosition">;

export type Node = ReactFlowNode<NodeData>;
