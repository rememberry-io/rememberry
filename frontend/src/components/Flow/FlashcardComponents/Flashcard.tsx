// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import React, { memo, useState } from "react";
import { Handle, NodeToolbar, Position, useViewport } from "reactflow";
import { useAddFlashcard } from "../addFlashcardsAndStacks";
import { FlashcardDialog } from "./FlashcardDialog";
import { TrafficLights } from "./TrafficLights";

const normalizeZoom = (zoom: number): number => {
  return 1 / zoom;
}

interface NodeProps {
  id: string;
}

interface FlashcardProps extends NodeProps {
  data: {
    category: string;
    frontText: string;
    backText: string;
    borderColor?: string;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, id }) => {
  const [isFront, setIsFront] = useState(true);
  const [selectedColor, setSelectedColor] = useState(
    data.borderColor || "ashberry",
  );

  const toggleCard = () => {
    setIsFront(!isFront);
    console.log("changed");
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const { zoom } = useViewport();

  return (
    <div
      className={`relative box-border bg-white flex flex-col rounded-lg items-center justify-center h-auto max-w-xs border-2 border-${selectedColor} border-opacity-25 hover:border-opacity-50 `}
      style={{
        borderWidth: normalizeZoom(zoom) * 3,
      }}
    >
      <NodeToolbar position={Position.Right} nodeId={id} align="center">
        <div className="flex flex-row align-middle ml-2">
          <div className="pr-2 mt-1">
            <TrafficLights onColorChange={handleColorChange} />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Button onClick={toggleCard} variant="secondary" size="icon">
              <RotateCcw />
            </Button>
            <FlashcardDialog
              flashcardCategory={data.category}
              flashcardFrontText={data.frontText}
              flashcardBackText={data.backText}
            />
          </div>
        </div>
      </NodeToolbar>
      <div className="p-4 rounded-lg">
        {/** <button onClick={toggleCard}> */}
        <div className="inputWrapper">
          <div className="dragHandle">
            <div className="flex items-center justify-between">
              <input
                className="text-sm break-words"
                defaultValue={isFront ? data.frontText : data.backText}
              />
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-ashberry"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-ashberry"
      />
    </div>
  );
};

export default memo(Flashcard);
