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
};



const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "1",
      type: "stack",
      position: { x: 300, y: 100 },
      data: {
        frontText: "Cellular structure",
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
        category: "New Category",
        borderColor: "",
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

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
  updateNode: (
    nodeId: string,
    frontText: string,
    backText: string,
    category: string,
    borderColor: string,
  ) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = {
            ...node.data,
            frontText,
            backText,
            category,
            borderColor,
          };
        }

        return node;
      }),
    });
  },
}));

export default useStore;
