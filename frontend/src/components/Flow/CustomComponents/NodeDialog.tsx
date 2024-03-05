import React, { useState } from "react";
import { NodeDialogUI } from "./NodeDialogUi";

interface NodeDialogWithStateProps {
  nodeParentFrontside: string;
  frontside: string;
  backside: string;
  isDialogOpen: boolean;
  autoOpen?: boolean;
  onSubmit: (frontside: string, backside: string) => void;
  closeDialog: () => void;
}

export const NodeDialog: React.FC<NodeDialogWithStateProps> = ({
  nodeParentFrontside,
  frontside,
  backside,
  isDialogOpen,
  onSubmit,
  closeDialog,
}) => {
  const [frontsideState, setFrontsideState] = useState(frontside);
  const [backsideState, setBacksideState] = useState(backside);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(frontsideState, backsideState);
    closeDialog();
  };

  const discardChanges = () => {
    setFrontsideState(frontside);
    setBacksideState(backside);
    closeDialog();
  };

  return (
    <NodeDialogUI
      parentNodeFrontside={nodeParentFrontside}
      frontside={frontsideState}
      backside={backsideState}
      isDialogOpen={isDialogOpen}
      closeDialog={closeDialog}
      onSubmit={handleSubmit}
      discardChanges={discardChanges}
      changeFrontside={(value: string) => setFrontsideState(value)}
      changeBackside={(value: string) => setBacksideState(value)}
    />
  );
};
