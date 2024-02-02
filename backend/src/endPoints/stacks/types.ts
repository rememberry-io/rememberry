export type StackWithChildren = {
  id: string;
  name: string;
  numberOfLearnedCards: number | null;
  numberOfUnlearnedCards: number | null;
  createdAt: Date;
  updatedAt: Date;
  mapId: string;
  description: string;
  positioning: string;
  parentStackId: string | null;
  children?: StackWithChildren[];
};
