import { nanoid } from "nanoid/non-secure";
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

export const CARD_NODE_TYPE = {
  flashcard: "flashcard",
  stack: "stack",
} as const;

export type CardNodeData = {
  frontside: string;
  backside: string;
  createdAt: Date;
  updatedAt: Date;
  stackId?: string;
  mapId?: string;
};

export type CardNode = Node<CardNodeData>;

export interface CardNodeStore {
  nodes: CardNode[];
  edges: Edge[];
  actions: {
    addNode: (node: CardNode) => void;
    addChildNode: (parentNode: CardNode, flashcard: CardNode) => void;
    updateNode: (node: CardNode) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
  };
}

export const useCardNodeStore = create<CardNodeStore>()((set, get) => ({
  nodes: [],
  edges: [],
  actions: {
    addNode: (node) => {
      set((state) => ({ nodes: [...state.nodes, node] }));
    },
    addChildNode: (parentNode: CardNode, flashcard: CardNode) => {
      const newFlashcard = flashcard;

      newFlashcard.parentNode = parentNode.id;

      const newEdge = {
        id: nanoid(),
        source: parentNode.id,
        target: newFlashcard.id,
      };

      const allNodes = get().nodes;

      if (parentNode.type === "stack") {
        set({
          nodes: [...get().nodes, newFlashcard],
          edges: [...get().edges, newEdge],
        });
      }
      const updatedNodes = allNodes.map((mappedNode) =>
        mappedNode.id === parentNode.id
          ? { ...mappedNode, type: "stack" }
          : mappedNode,
      );

      set({ nodes: updatedNodes, edges: [...get().edges, newEdge] });
    },
    updateNode: (node) => {
      set({
        nodes: get().nodes.map((mappedNode) => {
          if (mappedNode.id === node.id) return node;
          return mappedNode;
        }),
      });
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
  },
}));
