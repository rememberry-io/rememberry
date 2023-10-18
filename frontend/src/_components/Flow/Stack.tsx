import { Button } from "@/_components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";

interface StackProps {
  data: {
    frontText: string;
    backText: string;
  };
}

export const Stack: React.FC<StackProps> = ({ data }) => {
  const [isFront, setIsFront] = useState(true);

  const toggleStack = () => {
    setIsFront(!isFront);
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="flex text-center flex-col px-6 py-6 rounded-md bg-blue-700 text-white justify-center max-w-fit">
          <div className={`${isFront ? "" : "hidden"}`}>{data.frontText}</div>
          <div className={`${isFront ? "hidden" : ""}`}>{data.backText}</div>
        </div>
        <Button
          onClick={toggleStack}
          variant="secondary"
          size="icon"
          className="ml-4"
        >
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
};
