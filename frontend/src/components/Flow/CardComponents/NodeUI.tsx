import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import React, { useRef } from "react";
import { Position } from "reactflow";
import { NodeDialog } from "../CustomComponents/NodeDialog";
import { FlowTextArea } from "../CustomComponents/flowTextArea";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { CustomHandle } from "./CustomHandle";
import { ColorType, TrafficLights } from "./TrafficLights";

interface NodeUIProps {
  isFront: boolean;
  frontText: string;
  backText: string;
  borderClasses: string;
  isDialogOpen: boolean;
  isFocused: boolean;
  normalizeZoom: (zoom: number) => number;
  zoom: number;
  toggleCard: () => void;
  openDialog: () => void;
  closeDialog: () => void;
  handleDialogSubmit: (front: string, back: string, parentName: string) => void;
  handleColorChange: (color: ColorType) => void;
  cardType: string;
  parentName: string;
  nodeId: string;
  focus: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
  blur: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
}

export const NodeUI: React.FC<NodeUIProps> = ({
  isFront,
  frontText,
  backText,
  borderClasses,
  isDialogOpen,
  isFocused,
  normalizeZoom,
  zoom,
  toggleCard,
  openDialog,
  closeDialog,
  handleDialogSubmit,
  handleColorChange,
  cardType,
  parentName,
  nodeId,
  focus,
  blur,
}) => {
  // for multiline textarea
  const frontTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontTextAreaRef.current, frontText);
  useAutosizeTextArea(backTextAreaRef.current, backText);

  return (
    <div
      tabIndex={0}
      onFocus={focus}
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
                  changes={function (): void {}}
                  isInput={false}
                  onSubmit={function (): void {}}
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
                  changes={function (): void {}}
                  isInput={false}
                  onSubmit={function (): void {}}
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
            right: "-3rem",
            transform: `scale(${normalizeZoom(zoom)})`,
          }}
        >
          <div className=" ">
            <Button
              variant="secondary"
              size="icon"
              className=""
              onClick={openDialog}
            >
              <Maximize2 />
            </Button>
            <NodeDialog
              nodeId={nodeId}
              cardType={cardType}
              onSubmit={handleDialogSubmit}
              cardParentName={parentName}
              cardFrontText={frontText}
              cardBackText={backText}
              isDialogOpen={isDialogOpen}
              closeDialog={closeDialog}
            />
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
              <NodeDialog
                cardType={cardType}
                nodeId={nodeId}
                onSubmit={handleDialogSubmit}
                cardParentName={parentName}
                cardFrontText={frontText}
                cardBackText={backText}
                isDialogOpen={isDialogOpen}
                closeDialog={closeDialog}
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
