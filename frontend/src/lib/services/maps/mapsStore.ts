import { create } from "zustand";

export type Map = {
  id: string;
  userId: string;
  peerId: string | null;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

interface MapsStore {
  maps: Map[];
  actions: {
    addMap: (map: Map) => Map;
    removeMap: (id: string) => void;
  };
}

export const useMapsStore = create<MapsStore>((set) => ({
  maps: [],
  actions: {
    addMap: (map) => {
      set((state) => ({
        maps: [...state.maps, map],
      }));
      return map;
    },
    removeMap: (id) => {
      set((state) => ({
        maps: state.maps.filter((map) => map.id !== id),
      }));
    },
  },
}));
