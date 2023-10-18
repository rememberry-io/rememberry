// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/_components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { TrafficLights } from "./TrafficLights";

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
      <div className="flex flex-row items-center">
        <div className="flex text-center flex-col px-6 rounded-md w-64 border-2 border-black bg-white mb-4">
          <div className="p-4">
            <div className="text-sm text-blue-500 ">{data.category}</div>

            <div className={`${isFront ? "" : "hidden"}`}>{data.frontText}</div>
            <div className={`${isFront ? "hidden" : ""}`}>{data.backText}</div>
          </div>
        </div>
        <Button
          onClick={toggleCard}
          variant="secondary"
          size="icon"
          className="ml-4"
        >
          <RotateCcw />
        </Button>
      </div>
      <TrafficLights />
    </div>
  );
};
