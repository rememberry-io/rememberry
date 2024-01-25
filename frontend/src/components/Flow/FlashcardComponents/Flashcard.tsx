// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/components/ui/button";
import { Maximize2, RotateCcw } from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";
import { Position, useViewport } from "reactflow";
import useStore, { RFState } from "../FlowElements/nodeStore";
import { FlashcardDialog } from "./FlashcardDialog";
import { ColorType, TrafficColor, TrafficLights } from "./TrafficLights";

import { shallow } from "zustand/shallow";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { CustomHandle } from "./CustomHandle";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const normalizeZoom = (zoom: number): number => {
  return 1 / zoom;
};

interface NodeProps {
  id: string;
}

interface FlashcardProps extends NodeProps {
  data: {
    id: string;
    stackName: string;
    frontText: string;
    backText: string;
    borderColor?: ColorType;
    isNew?: boolean;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, id }) => {
  const [isFront, setIsFront] = useState(true);
  const [stackName, setStackName] = useState(data.stackName);
  const [frontText, setFront] = useState(data.frontText);
  const [backText, setBack] = useState(data.backText);
  const [isNew, setIsNew] = useState(data.isNew);

  const [selectedColor, setSelectedColor] = useState<
    ColorType | null | undefined
  >(data.borderColor);

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
  };

  // zoom so that the tools and trafficlights are still visible when zoomed out
  const { zoom } = useViewport();

  const [isFocused, setIsFocused] = useState(false);

  function onFocus() {
    setTimeout(setIsFocused, 0, true);
  }
  function onBlur() {
    setTimeout(setIsFocused, 0, false);
  }
  const borderStyle = `border-${TrafficColor[selectedColor!] || "ashberry"}`;

  const { updateNode } = useStore(
    (state) => ({ updateNode: state.updateNode }),
    shallow,
  );
  useEffect(() => {
    if (isNew) {
      setIsDialogOpen(true);
      // Update isNew to false so that the dialog doesn't open automatically again
      setIsNew(false);
    }
  }, [isNew]);
  const handleDialogSubmit = (
    front: string,
    back: string,
    stackName: string,
  ) => {
    setFront(front);
    setBack(back);
    setStackName(stackName);
    setIsDialogOpen(false);
    updateNode(id, front, back, stackName, selectedColor || "", isNew || false);
  };

  // for multiline textarea
  const frontTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontTextAreaRef.current, frontText);
  useAutosizeTextArea(backTextAreaRef.current, backText);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeout = useRef<number | undefined>(undefined);

  const toggleCard = () => {
    setIsFront(!isFront);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={toggleCard}
      className={`dragHandle min-w-48 relative box-border bg-white flex flex-col rounded-lg items-center justify-center h-auto max-w-xs border-2 ${borderStyle} border-opacity-25 hover:border-opacity-50 `}
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
            <div className="flex flex-col items-center space-y-2">
              <Button onClick={toggleCard} variant="secondary" size="icon">
                <RotateCcw />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className=""
                onClick={openDialog}
              >
                <Maximize2 />
              </Button>
              <FlashcardDialog
                nodeId={id}
                onSubmit={handleDialogSubmit}
                flashcardStackName={stackName}
                flashcardFrontText={frontText}
                flashcardBackText={backText}
                isDialogOpen={isDialogOpen}
                closeDialog={() => setIsDialogOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="p-4 rounded-lg ">
        <div className="inputWrapper">
          <div>
            <div className="flex items-center justify-between">
              {isFront ? (
                <textarea
                  className="h-fit outline-none resize-none break-words"
                  value={frontText}
                  ref={frontTextAreaRef}
                  rows={1}
                  readOnly
                />
              ) : (
                <textarea
                  className="h-fit outline-none resize-none break-words"
                  value={backText}
                  ref={backTextAreaRef}
                  rows={1}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomHandle position={Position.Top} />
      <CustomHandle position={Position.Bottom} />
    </div>
  );
};

export default memo(Flashcard);
