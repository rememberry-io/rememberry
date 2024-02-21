// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";
import { Position, useViewport } from "reactflow";
import useStore, { RFState } from "../stores/nodeStore";

import { ColorType, TrafficColor, TrafficLights } from "./TrafficLights";

import { shallow } from "zustand/shallow";
import { FlowDialog } from "../CustomComponents/cardDialog";
import { FlowTextArea } from "../CustomComponents/flowTextArea";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { CustomHandle } from "./CustomHandle";

import useFlashcardFocusStore from "../stores/cardFocusStore";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const normalizeZoom = (zoom: number): number => {
  // Adjust the calculation as necessary to fit the desired size
  return Math.max(1 / zoom, 0.5); // Ensure it never goes below 0.5, for instance
};

interface NodeProps {
  id: string;
}

interface FlashcardProps extends NodeProps {
  type: string;
  data: {
    id: string;
    parentName: string;
    frontText: string;
    backText: string;
    borderColor?: ColorType;
    isNew?: boolean;
    newNodeType: string;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, id, type }) => {
  const [isFront, setIsFront] = useState(true);
  const [parentName, setParentName] = useState(data.parentName);
  const [frontText, setFront] = useState(data.frontText);
  const [backText, setBack] = useState(data.backText);
  const [isNew, setIsNew] = useState(data.isNew);
  const [cardType, setCardType] = useState(type);

  const [selectedColor, setSelectedColor] = useState<
    ColorType | null | undefined
  >(data.borderColor);

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
  };

  // zoom so that the tools and trafficlights are still visible when zoomed out
  const { zoom } = useViewport();

  const { focusedId, setFocusedId } = useFlashcardFocusStore();
  const isFocused = id === focusedId;

  const onFocus = () => {
    setFocusedId(id);
  };
  const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const isFocusingChild =
      e.currentTarget.contains(e.relatedTarget) || isDialogOpen;
    if (isFocused && !isFocusingChild) {
      setFocusedId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (isFocused) {
        setFocusedId(null);
      }
    };
  }, [isFocused, setFocusedId]);

  const borderStyle = `border-${TrafficColor[selectedColor!] || "ashberry"}`;

  const { updateNode } = useStore(
    (state) => ({ updateNode: state.updateNode }),
    shallow,
  );
  useEffect(() => {
    if (isNew) {
      setIsDialogOpen(true);
      setIsNew(false);
    }
  }, [isNew]);

  const handleDialogSubmit = (
    front: string,
    back: string,
    parentName: string,
  ) => {
    setFront(front);
    setBack(back);
    setParentName(parentName);
    setIsDialogOpen(false);
    updateNode(
      id,
      front,
      back,
      parentName,
      selectedColor || "",
      isNew || false,
    );
  };

  // for multiline textarea
  const frontTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontTextAreaRef.current, frontText);
  useAutosizeTextArea(backTextAreaRef.current, backText);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleCard = () => {
    setIsFront(!isFront);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
    //TODO: Flashcard on create, open dialog
  };

  const closeDialog = () => setIsDialogOpen(false);

  const borderClasses =
    cardType === "flashcard"
      ? `border-2 ${borderStyle} border-opacity-50 hover:border-opacity-75`
      : "border-2 border-ashberry border-opacity-50 hover:border-opacity-75";

  return (
    <div
      tabIndex={0}
      onFocus={onFocus}
      className={`dragHandle hover:cursor-pointer  min-w-48 relative border-none dark:bg-dark-800 bg-white flex flex-col rounded-lg items-center justify-center h-auto max-w-xs `}
      style={{
        borderWidth: normalizeZoom(zoom) * 3,
      }}
    >
      {cardType === "stack" && (
        <>
          <div className="flex relative flex-row align-middle ml-2"></div>
          <div
            onClick={toggleCard}
            onBlur={onBlur}
            className={`p-2 bg-primary rounded-lg ${borderClasses} `}
          >
            <div className="inputWrapper">
              <div>
                <FlowTextArea
                  isStack={true}
                  value={isFront ? frontText : backText}
                  textAreaRef={isFront ? frontTextAreaRef : backTextAreaRef}
                  rows={1}
                  className={"bg-primary text-white"}
                  placeholder={""}
                  changes={function (value: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  isInput={false}
                  onSubmit={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {cardType === "flashcard" && (
        <>
          <div
            onClick={toggleCard}
            onBlur={onBlur}
            className={`p-2 rounded-lg ${borderClasses}`}
          >
            <div className="inputWrapper">
              <div>
                <FlowTextArea
                  isStack={false}
                  className={""}
                  value={isFront ? frontText : backText}
                  textAreaRef={isFront ? frontTextAreaRef : backTextAreaRef}
                  rows={1}
                  placeholder={""}
                  changes={function (value: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  isInput={false}
                  onSubmit={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {isFocused && cardType === "stack" && (
        <div
          className="absolute"
          style={{
            right: "-5rem",
            transform: `scale(${normalizeZoom(zoom)})`,
          }}
        >
          <div className="flex relative flex-row align-middle ml-2">
            <div className="flex flex-col items-center justify-center">
              <Button
                variant="secondary"
                size="icon"
                className=""
                onClick={openDialog}
              >
                <Maximize2 />
              </Button>
              <FlowDialog
                nodeId={id}
                cardType={cardType}
                onSubmit={handleDialogSubmit}
                flashcardParentName={parentName}
                flashcardFrontText={frontText}
                flashcardBackText={backText}
                isDialogOpen={isDialogOpen}
                closeDialog={() => setIsDialogOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isFocused && cardType === "flashcard" && (
        <div
          className="absolute"
          style={{
            right: "-5rem",
            transform: `scale(${normalizeZoom(zoom)})`,
          }}
        >
          <div className="flex relative flex-row align-middle ml-2">
            <div className="z-10 pr-2 mt-1">
              <TrafficLights onColorChange={handleColorChange} />
            </div>
            <div className="flex flex-col items-center justify-center ">
              <Button
                variant="secondary"
                size="icon"
                className=""
                onClick={openDialog}
              >
                <Maximize2 />
              </Button>
              <FlowDialog
                cardType={cardType}
                nodeId={id}
                onSubmit={handleDialogSubmit}
                flashcardParentName={parentName}
                flashcardFrontText={frontText}
                flashcardBackText={backText}
                isDialogOpen={isDialogOpen}
                closeDialog={() => setIsDialogOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <CustomHandle position={Position.Top} />
      <CustomHandle position={Position.Bottom} />
    </div>
  );
};

export default memo(Flashcard);
