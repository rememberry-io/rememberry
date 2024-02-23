import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { FlowTextArea } from "./flowTextArea";

interface NodeDialogProps {
  nodeId: string;
  cardParentName: string;
  cardFrontText: string;
  cardBackText: string;
  onSubmit: (frontText: string, backText: string, parentText: string) => void;
  isDialogOpen: boolean;
  closeDialog: () => void;
  cardType: string;
  autoOpen?: boolean;
}

export const NodeDialog: React.FC<NodeDialogProps> = (dialogProps) => {
  const [parentName, setParentName] = useState(dialogProps.cardParentName);
  const [frontText, setFrontText] = useState(dialogProps.cardFrontText);
  const [backText, setBackText] = useState(dialogProps.cardBackText);
  const [passedCardType, setPassedCardType] = useState(dialogProps.cardType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dialogProps.onSubmit(frontText, backText, parentName);
    dialogProps.closeDialog();
  };

  const discardChanges = () => {
    setFrontText(dialogProps.cardFrontText);
    setBackText(dialogProps.cardBackText);
    dialogProps.closeDialog();
  };

  const frontTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontTextAreaRef.current, frontText);
  useAutosizeTextArea(backTextAreaRef.current, backText);

  const handleChangeFront = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valFront = evt.target?.value;
    setFrontText(valFront);
  };

  const handleChangeBack = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valBack = evt.target?.value;

    setBackText(valBack);
  };

  return (
    <Dialog
      open={dialogProps.isDialogOpen || dialogProps.autoOpen}
      onOpenChange={discardChanges}
    >
      <DialogContent onAbort={dialogProps.closeDialog}>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <>
                <div className="font-medium text-primary dark:text-white leading-10">
                  {parentName}
                </div>
              </>

              <FlowTextArea
                className=" "
                value={frontText}
                placeholder="Front Text"
                textAreaRef={frontTextAreaRef}
                rows={1}
                changes={(value: string) => setFrontText(value)}
                cardType={passedCardType}
                isInput={true}
                onSubmit={() => handleSubmit}
              />
            </div>

            <div className="leading-6 text-justify">
              <FlowTextArea
                className=" "
                value={backText}
                placeholder="Back Text"
                textAreaRef={backTextAreaRef}
                rows={1}
                changes={(value: string) => setBackText(value)}
                cardType={passedCardType}
                isInput={true}
                onSubmit={() => handleSubmit}
              />
            </div>
            <Button type="submit" className="  mt-4" variant="default">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
