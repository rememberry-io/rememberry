import { Button } from "@/_components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { Maximize2 } from "lucide-react";

interface StackProps {
	data: {
		frontText: string;
		backText: string;
	}
}

export const Stack: React.FC<StackProps> = ({ data }) => {
  const [isFront, setIsFront] = useState(true);

  const toggleStack = () => {
    setIsFront(!isFront);
  };

  const openCard = () => {

  }

  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="flex text-center flex-col p-5 rounded-md bg-blue-700 text-white justify-center w-56">
			<div className="line-clamp-3">
				{isFront? data.frontText : data.backText}
			</div>
        </div>
		{/* <div className="flex flex-col space-y-4"></div> */}
        	<Button
          	onClick={toggleStack}
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
  );
};
