import { nanoid } from "nanoid/non-secure";
import create from "zustand";

export interface Map {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface MapState {
  categories: Map[];
  addMap: (name: string) => void;
  removeMap: (id: string) => void;
}

export const useStore = create<MapState>((set) => ({
  // initial state
  categories: [],
  // methods for manipulating state
  addMap: (name: string) => {
    set((state) => ({
      categories: [
        ...state.categories,
        {
          id: nanoid(),
          name,
          createdAt: new Date(),
          completed: false,
        } as unknown as Map,
      ],
    }));
  },
  removeMap: (id) => {
    set((state) => ({
      categories: state.categories.filter((Map) => Map.id !== id),
    }));
  },
}));
