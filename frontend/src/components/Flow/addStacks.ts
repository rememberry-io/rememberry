import { nanoid } from "nanoid/non-secure";
import { useCallback } from "react";
import { useReactFlow } from "reactflow";

let flashcardId = 5;
let stackId = 5;

export function useAddStack() {
  
  const reactFlowInstance = useReactFlow();
  const addStack = useCallback(() => {
    const newStack = {
      id: nanoid(),
      type: "stack",
      position: {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      },
      data: {
        frontText: "New Stack",
      },
    };
  }, [reactFlowInstance]);

  return addStack;
}
