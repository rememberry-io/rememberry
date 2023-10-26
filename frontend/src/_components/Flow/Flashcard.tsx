// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/_components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { FlashcardDialog } from "./FlashcardDialog";
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

  const openModal = () => {};

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
      </div>
      <TrafficLights />
    </div>
  );
};
