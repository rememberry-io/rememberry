import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

export type RFState = {
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
    {
      id: "2",
      type: "flashcard",
      position: { x: 600, y: 200 },
      data: {
        frontText: "What is your name?",
        backText: "Slim shady",
        category: "#1 - Cellular Structure",
        borderColor: "red",
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
}));

export default useStore;
