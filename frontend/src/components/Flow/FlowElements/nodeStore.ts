import { nanoid } from "nanoid/non-secure";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  XYPosition,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

export type RFState = {
  addChildNode: any;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNode: (
    nodeId: string,
    frontText: string,
    backText: string,
    stackName: string,
    borderColor: string,
    isNew: boolean,
  ) => void;
  updateNodeType: (nodeId: string, newNodeType: string) => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: nanoid(),
      type: "stack",
      position: { x: 300, y: 100 },
      data: {
        frontText: "New Front Text",
        backText: "New Back Text",
        mainStackID: "",
      },
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: "flashcard",
      data: {
        frontText: "New Front Text",
        backText: "New Back Text",
        stackName: parentNode.data.stackName,
        borderColor: "red",
        isNew: true,
      },
      position,
      dragHandle: ".dragHandle",
      parentNode: parentNode.id,
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    let updatedNodes = [...get().nodes, newNode];
    let updatedEdges = [...get().edges, newEdge];

    const childEdges = updatedEdges.filter(
      (edge) => edge.source === parentNode.id,
    );
    if (childEdges.length >= 1 && parentNode.type !== "stack") {
      updatedNodes = updatedNodes.map((node) =>
        node.id === parentNode.id ? { ...node, type: "stack" } : node,
      );
    }

    set({ nodes: updatedNodes, edges: updatedEdges });
  },
  updateNode: (
    nodeId: string,
    frontText: string,
    backText: string,
    stackName: string,
    borderColor: string,
    isNew: boolean,
  ) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              frontText,
              backText,
              stackName,
              borderColor,
              isNew,
            },
          };
        }
        return node;
      }),
    });
  },
  updateNodeType: (nodeId: string, newNodeType: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // Preserve frontText and backText when type changes to 'stack'
          if (newNodeType === "stack") {
            return {
              ...node,
              type: newNodeType,
              data: {
                ...node.data, // Keeps existing data
                stackName: node.data.frontText, // Use frontText as stackName
              },
            };
          } else {
            return { ...node, type: newNodeType };
          }
        }
        return node;
      }),
    });
  },
}));

export default useStore;
