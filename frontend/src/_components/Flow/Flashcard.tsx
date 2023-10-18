// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/_components/ui/button";
import { RotateCcw,  Maximize2 } from "lucide-react";
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

  const openCard = () => {

  }

  return (
    <div>
      <div className="flex flex-row items-center bg-red-500">
        <div className="flex text-center flex-col p-2 rounded-md w-64 h-auto max-h-32 border-2 border-black bg-white mb-4 text-ellipsis overflow-hidden bg-yellow-300">
          <div className="p-2">
            <div className="text-sm text-blue-500 ">{data.category}</div>

            <div className={`${isFront ? "" : "hidden"}`}>{data.frontText}</div>
            <div className={`${isFront ? "hidden" : ""}`}>{data.backText}</div>
          </div>
        </div>
		<div className="flex flex-col space-y-4 bg-green-300">

        <Button
          onClick={toggleCard}
          variant="secondary"
          size="icon"
          className="ml-4"
		  >
          <RotateCcw />
        </Button>
		<Button onClick={openCard} variant="secondary" size="icon" className="ml-4">
			<Maximize2 />
		</Button>
			</div>
      </div>
     	 {/* <TrafficLights /> */}
    </div>
  );
};
