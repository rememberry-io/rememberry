// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { TrafficLights } from "@/components/Flow/TrafficLights";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { memo, useState } from "react";
import { NodeToolbar, Position } from "reactflow";
import { FlashcardDialog } from "./FlashcardDialog";

interface FlashcardProps {
  data: {
    category: string;
    frontText: string;
    backText: string;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data }) => {
  const [isFront, setIsFront] = useState(true);

  const toggleCard = () => {
    setIsFront(!isFront);
  };

  return (
    <div>
      <div className="flex flex-row justify-center">
        <div className="flex text-center flex-col p-2 rounded-md w-56 h-auto max-h-32 border-2 border-black bg-white mb-4">
          <div className="p-2">
            <div className="text-sm text-blue-500 ">{data.category}</div>
            <div className="line-clamp-3 text-black">
              {isFront ? data.frontText : data.backText}
            </div>
          </div>
        </div>
        <NodeToolbar position={Position.Right}>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={toggleCard}
              variant="secondary"
              size="icon"
              className="ml-4"
            >
              <RotateCcw />
            </Button>
            <FlashcardDialog
              flashcardCategory={data.category}
              flashcardFrontText={data.frontText}
              flashcardBackText={data.backText}
            />
          </div>
        </NodeToolbar>
      </div>
      <TrafficLights />
    </div>
  );
};

export default memo(Flashcard);
