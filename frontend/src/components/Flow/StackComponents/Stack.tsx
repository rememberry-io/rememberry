// Stack.jsx
import { Button } from "@/components/ui/button";
import { Maximize2, RotateCcw } from "lucide-react";
import React, { useRef, useState } from "react";
import { Position, useViewport } from "reactflow";
import { CustomHandle } from "../FlashcardComponents/CustomHandle";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface StackProps {
  data: {
    frontText: string;
    backText: string;
  };
}

export const Stack: React.FC<StackProps> = ({ data }) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [frontText, setFrontText] = useState(data.frontText);
  const textAreaRef = useRef(null);

  useAutosizeTextArea(textAreaRef.current, frontText);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setFrontText(val);
  };
  const [isFront, setIsFront] = useState(true);
  const toggleCard = () => setIsFront(!isFront);
  const { zoom } = useViewport();
  const normalizeZoom = (zoom: number): number => {
    return 1 / zoom;
  };

  return (
    <div className="flex flex-row items-center">
      <button onClick={() => setInputOpen(true)}>
        <div
          className={`flex text-center flex-col p-3 text-white rounded-md bg-primary justify-center ${inputOpen ? "outline outline-gray-300" : ""}`}
        >
          {inputOpen ? (
            <textarea
              className="text-xl bg-primary rounded-md h-fit outline-none resize-none break-words"
              defaultValue={frontText}
              placeholder="Give this stack a name"
              ref={textAreaRef}
              onBlur={() => setInputOpen(false)}
              rows={1}
              onChange={handleChange}
            />
          ) : (
            <textarea
              className="text-xl bg-primary rounded-md h-fit outline-none resize-none break-words"
              defaultValue={frontText}
              ref={textAreaRef}
              rows={1}
              readOnly
            />
          )}
          <div
            className="absolute"
            style={{
              right: "-5rem",
              transform: `scale(${normalizeZoom(zoom)})`,
            }}
          >
            <div className="flex relative flex-row align-middle ml-2">
              <div className="flex flex-col items-center space-y-2">
                <Button onClick={toggleCard} variant="secondary" size="icon">
                  <RotateCcw />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Maximize2 />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </button>
      <CustomHandle position={Position.Top} />
      <CustomHandle position={Position.Bottom} />
    </div>
  );
};

export default Stack;
