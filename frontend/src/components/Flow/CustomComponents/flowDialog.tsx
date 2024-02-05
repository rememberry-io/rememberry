import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { FlowTextArea } from "./flowTextArea";

interface FlowDialogProps {
  nodeId: string;
  flashcardParentName: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  onSubmit: (frontText: string, backText: string, parentText: string) => void;
  isDialogOpen: boolean;
  closeDialog: () => void;
  cardType: string;
}

export const FlowDialog: React.FC<FlowDialogProps> = ({
  nodeId,
  flashcardParentName,
  flashcardFrontText,
  flashcardBackText,
  onSubmit,
  isDialogOpen,
  closeDialog,
  cardType,
}) => {
  const [parentName, setParentName] = useState(flashcardParentName);
  const [frontText, setFrontText] = useState(flashcardFrontText);
  const [backText, setBackText] = useState(flashcardBackText);
  const [passedCardType, setPassedCardType] = useState(cardType);

  const handleSubmit = () => {
    onSubmit(frontText, backText, parentName);
    closeDialog();
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
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleSubmit}>
        <DialogContent onAbort={closeDialog}>
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
                  value={frontText === "New Front Text" ? "" : frontText}
                  placeholder="Front Text"
                  textAreaRef={frontTextAreaRef}
                  rows={1}
                  changes={(value: string) => setFrontText(value)}
                  readOnly={false}
                  isStack={false}
                  isInput={true}
                />
              </div>

              <div className="leading-6 text-justify">
                <FlowTextArea
                  className=" "
                  value={backText === "New Back Text" ? "" : backText}
                  placeholder="Back Text"
                  textAreaRef={backTextAreaRef}
                  rows={1}
                  changes={(value: string) => setBackText(value)}
                  readOnly={false}
                  isStack={false}
                  isInput={true}
                />
              </div>
              <Button className="  mt-4" variant="default">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
