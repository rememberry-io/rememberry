// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { memo, useState } from "react";
import { Handle, Position, useViewport } from "reactflow";
import { FlashcardDialog } from "./FlashcardDialog";
import { ColorType, TrafficColor, TrafficLights } from "./TrafficLights";

const normalizeZoom = (zoom: number): number => {
  return 1 / zoom;
};

interface NodeProps {
  id: string;
}

interface FlashcardProps extends NodeProps {
  data: {
    category: string;
    frontText: string;
    backText: string;
    borderColor?: ColorType;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, id }) => {
  const [isFront, setIsFront] = useState(true);
  const [selectedColor, setSelectedColor] = useState<
    ColorType | null | undefined
  >(data.borderColor);

  const toggleCard = () => {
    setIsFront(!isFront);
  };

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
  };

  const { zoom } = useViewport();

  const [isFocused, setIsFocused] = useState(false);

  function onFocus() {
    setTimeout(setIsFocused, 0, true);
  }
  function onBlur() {
    setTimeout(setIsFocused, 0, false);
  }
  const borderStyle = `border-${TrafficColor[selectedColor!] || "ashberry"}`;

  return (
    <div
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`dragHandle relative box-border bg-white flex flex-col rounded-lg items-center justify-center h-auto max-w-xs border-2 ${borderStyle} border-opacity-25 hover:border-opacity-50 `}
      style={{
        borderWidth: normalizeZoom(zoom) * 3,
      }}
    >
      {isFocused && (
        <div
          className="absolute"
          style={{
            right: "-5rem",
            transform: `scale(${normalizeZoom(zoom)})`,
          }}
        >
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
        </div>
      )}
      <div className="p-4 rounded-lg">
        <div className="inputWrapper">
          <div>
            <div className="flex items-center justify-between">
              <input
                placeholder="Enter a text"
                className="text-sm break-words px-4 py-3 focus:outline-none w-full hover:bg-gray-50 focus:bg-gray-50 rounded"
                defaultValue={isFront ? data.frontText : data.backText}
              />
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ placeSelf: "center", height: "0.75rem", width: "0.75rem", background: "#E6E9EF", borderRadius: "0.25rem" }} />
      <Handle type="source" position={Position.Bottom} style={{ placeSelf: "center", height: "0.75rem", width: "0.75rem", background: "#E6E9EF", borderRadius: "0.25rem" }} />
    </div>
  );
};

export default memo(Flashcard);
