import useStore from "@/components/Flow/FlowElements/nodeStore"; // Adjust the import path as needed
import { nanoid } from "nanoid/non-secure";
import { useCallback } from "react";

export function useAddStack() {
  const { addNode } = useStore();

  const addStack = useCallback(() => {
    const newStack = {
      id: nanoid(),
      type: "stack",
      position: {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      },
      data: { frontText: "New Stack", backText: "Description" },
    };

    addNode(newStack);
  }, [addNode]);

  return addStack;
}
