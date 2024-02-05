export type StackWithChildren = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  mapId: string;
  description: string;
  xPosition: number;
  yPosition: number;
  parentStackId: string | null;
  children?: StackWithChildren[];
};
