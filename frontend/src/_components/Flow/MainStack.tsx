import { Button } from "@/_components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";

interface MainStackProps {
  data: {
    frontText: string;
    backText: string;
  };
}

export const MainStack: React.FC<MainStackProps> = ({ data }) => {
  const [isFront, setIsFront] = useState(true);

  const toggleStack = () => {
    setIsFront(!isFront);
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="flex text-center flex-col p-6 rounded-md bg-green-700 text-white justify-center max-w-fit">
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
