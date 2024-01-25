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
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "1",
      type: "stack",
      position: { x: 300, y: 100 },
      data: {
        stackName: "Cellular structure",
        mainstackID: "",
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

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
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
}));

export default useStore;
