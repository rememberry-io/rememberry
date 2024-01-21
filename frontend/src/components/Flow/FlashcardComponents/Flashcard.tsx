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
    borderColor?: string;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data }) => {
  const [isFront, setIsFront] = useState(true);
  const [selectedColor, setSelectedColor] = useState(data.borderColor || "ashberry/10");

  const toggleCard = () => {
    setIsFront(!isFront);
  };


  const handleColorChange = (color:string) => {
    setSelectedColor(color);
  };



  return (
    <div className={`flex flex-col rounded-md items-center justify-center h-auto max-w-xs border-2 border-${selectedColor} `}>
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm break-words">
            {isFront ? data.frontText : data.backText}
          </p>
          <div className="pl-6">
          <TrafficLights onColorChange={handleColorChange} />
          </div>
        </div>
        <NodeToolbar position={Position.Right}>
          <div className="flex flex-col space-y-4 mt-4">
            <Button onClick={toggleCard} variant="secondary" size="icon">
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
    </div>
  );
};

export default memo(Flashcard);
