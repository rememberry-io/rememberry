import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface FlashcardDialogProps {
  nodeId: string;
  flashcardStackName: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  onSubmit: (frontText: string, backText: string, stackName: string) => void;
  isDialogOpen: boolean;
  closeDialog: () => void;
  cardType: string;
}

export const FlashcardDialog: React.FC<FlashcardDialogProps> = ({
  nodeId,
  flashcardStackName,
  flashcardFrontText,
  flashcardBackText,
  onSubmit,
  isDialogOpen,
  closeDialog,
  cardType,
}) => {
  const [stackName, setstackName] = useState(flashcardStackName);
  const [frontText, setFrontText] = useState(flashcardFrontText);
  const [backText, setBackText] = useState(flashcardBackText);
  const [passedCardType, setPassedCardType] = useState(cardType);

  const handleSubmit = () => {
    onSubmit(frontText, backText, stackName);
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
      <Dialog open={isDialogOpen}>
        <DialogContent onAbort={handleSubmit}>
          <div>
            <div>
              {passedCardType === "stack" && (
                <>
                  <div className="font-medium text-primary leading-10">
                    {stackName}
                  </div>
                </>
              )}

              <textarea
                className=" rounded-md h-fit outline-none resize-none w-full break-words"
                defaultValue={frontText === "New Front Text" ? "" : frontText}
                placeholder="Front Text"
                ref={frontTextAreaRef}
                rows={1}
                onChange={handleChangeFront}
              />
            </div>
            <hr className="m-2" />
            <div className="leading-6 text-justify">
              <textarea
                className="rounded-md h-fit outline-none resize-none w-full break-words focus:outline-primary"
                defaultValue={backText === "New Back Text" ? "" : backText}
                placeholder="Back Text"
                ref={backTextAreaRef}
                rows={1}
                onChange={handleChangeBack}
              />
            </div>
            <Button
              className="focus:outline focus:outline-primary  mt-4"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
