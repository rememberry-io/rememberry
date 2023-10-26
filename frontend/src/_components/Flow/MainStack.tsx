import React from "react";

interface MainStackProps {
  toggleMainStack: () => void;
  isFront: boolean;
  frontText: string;
  backText: string;
}

export const MainStack: React.FC<MainStackProps> = ({
  frontText,
  backText,
  isFront,
  toggleMainStack,
}) => {
  return (
    <div className="flex justify-items-center">
      <div className="flex flex-row items-center mx-auto">
        <div className="p-6 rounded-md bg-blue-500 text-white justify-center overflow-hidden ">
          <div>{isFront ? frontText : backText}</div>
        </div>
        {/* <Button
          onClick={toggleMainStack}
          variant="secondary"
          size="icon"
          className="ml-4"
        >
          <RotateCcw />
        </Button> */}
      </div>
    </div>
  );
};
