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
  addNode: (node: any) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNode: (
    nodeId: string,
    frontText: string,
    backText: string,
    parentName: string,
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
        frontText: "Mock Front Text",
        backText: "Mock Back Text",
        parentName: "",
        mainStackID: "",
        borderColors: [],
      },
    },
  ],
  edges: [],
  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }));
  },
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
      type: "flashcard",
      id: nanoid(),
      data: {
        frontText: "",
        backText: "",
        parentName: parentNode.data.frontText,
        borderColor: "red",
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
    parentName: string,
    borderColor: string,
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
              parentName,
              borderColor,
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
                parentName: node.data.frontText, // Use frontText as parentName
              },
            };
          } else {
            return { ...node, type: newNodeType, data: { ...node.data } };
          }
        }
        return node;
      }),
    });
  },
}));

export default useStore;
