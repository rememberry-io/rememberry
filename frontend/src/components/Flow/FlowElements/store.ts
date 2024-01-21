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
import { nanoid } from 'nanoid/non-secure';

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
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: 'flashcard',
      data: {
        frontText: "New Front Text",
        backText: "New Back Text",
        category: "New Category",
        borderColor: "red",
      },
      position,
      dragHandle: '.dragHandle',
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
}));

export default useStore;
