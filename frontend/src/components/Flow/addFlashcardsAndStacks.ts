import { useCallback } from "react";
import { useReactFlow } from "reactflow";

let flashcardId = 5;
let stackId = 5;

export function useAddFlashcard() {
  const reactFlowInstance = useReactFlow();
  const addFlashcard = useCallback(() => {
    const id = `${++flashcardId}`;
    const newFlashcard = {
      id: id,
      type: "flashcard",
      position: {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      },
      data: {
        frontText: "Front text",
        backText: "Back text",
        category: "Category",
      },
    };
    reactFlowInstance.addNodes(newFlashcard);
  }, [reactFlowInstance]);

  return addFlashcard;
}

export function useAddStack() {
  //const reactFlowInstance = useReactFlow();
  const addStack = useCallback(() => {
    const id = `${++stackId}`;
    const newStack = {
      id: id,
      type: "stack",
      position: {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      },
      data: {
        frontText: "Front text",
        backText: "Back text",
      },
    };
    
  }, [reactFlowInstance]);

  return addStack;
}
