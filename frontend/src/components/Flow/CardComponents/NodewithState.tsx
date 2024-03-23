import { Node } from "@/lib/services/node/node.types";
import { normalizeZoom } from "@/lib/utils";
import React, { memo, useState } from "react";
import { useViewport } from "reactflow";
import useFlashcardFocusStore from "../stores/cardFocusStore";
import { NodeUI } from "./NodeUI";
import { ColorType, TrafficColor } from "./TrafficLights";

type NodeWithStateProps = Omit<Node, "position">;

export const NodeWithState: React.FC<NodeWithStateProps> = ({ data, id }) => {
  const [isFront, setIsFront] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState<
    ColorType | null | undefined
  >(null);

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
  };

  const borderStyle = `border-${TrafficColor[selectedColor!] || "ashberry"}`;

  const borderClasses =
    data.nodeType === "flashcard"
      ? `border-2 ${borderStyle} border-opacity-50 hover:border-opacity-75`
      : "border-2 border-ashberry border-opacity-50 hover:border-opacity-75";

  // zoom so that the tools and trafficlights are still visible when zoomed out
  const { zoom } = useViewport();

  const { focusedId, setFocusedId } = useFlashcardFocusStore();
  const isFocused = id === focusedId;

  const onFocus = () => {
    setFocusedId(id);
    console.log("onFocus", id, focusedId);
  };

  const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const isFocusingChild =
      e.currentTarget.contains(e.relatedTarget) || isDialogOpen;
    if (isFocused && !isFocusingChild) {
      setFocusedId(null);
    }
  };

  const toggleCard = () => {
    setIsFront(!isFront);
  };
  return (
    <NodeUI
      nodeId={id}
      frontside={data.frontside}
      backside={data.backside}
      nodeType={data.nodeType}
      borderClasses={borderClasses}
      focus={onFocus}
      blur={onBlur}
      isFront={isFront}
      isFocused={isFocused}
      normalizeZoom={normalizeZoom}
      zoom={zoom}
      toggleCard={toggleCard}
      handleColorChange={handleColorChange}
    />
  );
};

export default memo(NodeWithState);
