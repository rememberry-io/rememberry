// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import React, { memo, useRef, useState } from "react";
import { useViewport } from "reactflow";
import useStore from "../stores/nodeStore";

import { ColorType, TrafficColor } from "./TrafficLights";

import { shallow } from "zustand/shallow";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

import useFlashcardFocusStore from "../stores/cardFocusStore";
import { NodeUI } from "./NodeUI";

const normalizeZoom = (zoom: number): number => {
  // Adjust the calculation as necessary to fit the desired size
  return Math.max(1 / zoom, 0.5); // Ensure it never goes below 0.5, for instance
};

interface NodePorps {
  type: string;
  id: string;
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

export const Flashcard: React.FC<NodePorps> = ({ data, type, id }) => {
  const [isFront, setIsFront] = useState(true);
  const [parentName, setParentName] = useState(data.parentName);
  const [frontText, setFront] = useState(data.frontText);
  const [backText, setBack] = useState(data.backText);
  const [isNew, setIsNew] = useState(data.isNew);
  const [cardType, setCardType] = useState(type);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState<
    ColorType | null | undefined
  >(data.borderColor);

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
  };

  const borderStyle = `border-${TrafficColor[selectedColor!] || "ashberry"}`;

  const borderClasses =
    cardType === "flashcard"
      ? `border-2 ${borderStyle} border-opacity-50 hover:border-opacity-75`
      : "border-2 border-ashberry border-opacity-50 hover:border-opacity-75";

  // zoom so that the tools and trafficlights are still visible when zoomed out
  const { zoom } = useViewport();

  const { focusedId, setFocusedId } = useFlashcardFocusStore();
  const isFocused = id === focusedId;
  console.log("isFocused", isFocused, id, focusedId);

  const onFocus = () => {
    setFocusedId(id);
    console.log("onFocus", id, focusedId);
  };

  const onBlur = () => {
    setFocusedId(null);
    console.log("onBlur", id, focusedId);
  }
 

  const { updateNode } = useStore(
    (state) => ({ updateNode: state.updateNode }),
    shallow,
  );

  const handleDialogSubmit = (
    front: string,
    back: string,
    parentName: string,
  ) => {
    setFront(front);
    setBack(back);
    setParentName(parentName);
    setIsDialogOpen(false);
    setIsNew(false); // Ensure isNew is updated here if not handled elsewhere
    updateNode(id, front, back, parentName, selectedColor || "", false);
  };

  // for multiline textarea
  const frontTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontTextAreaRef.current, frontText);
  useAutosizeTextArea(backTextAreaRef.current, backText);

  const toggleCard = () => {
    setIsFront(!isFront);
  };

  const openDialog = () => setIsDialogOpen(true);

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <NodeUI
      isFront={isFront}
      frontText={data.frontText}
      backText={data.backText}
      borderClasses={borderClasses}
      isDialogOpen={isDialogOpen}
      isFocused={isFocused}
      normalizeZoom={normalizeZoom}
      zoom={zoom}
      toggleCard={toggleCard}
      openDialog={openDialog}
      closeDialog={closeDialog}
      handleDialogSubmit={handleDialogSubmit}
      handleColorChange={handleColorChange}
      cardType={cardType}
      parentName={parentName}
      nodeId={id}
      focus={onFocus}
      blur={onBlur}

    />
  );
};

export default memo(Flashcard);
