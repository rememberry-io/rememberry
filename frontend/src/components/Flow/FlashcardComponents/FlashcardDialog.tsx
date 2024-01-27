import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface FlashcardDialogProps {
  nodeId: string;
  flashcardParentName: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  onSubmit: (frontText: string, backText: string, parentText: string) => void;
  isDialogOpen: boolean;
  closeDialog: () => void;
  cardType: string;
}

export const FlashcardDialog: React.FC<FlashcardDialogProps> = ({
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
      <Dialog open={isDialogOpen}>
        <DialogContent onAbort={handleSubmit}>
          <div >
            <div>
              <>
                <div className="font-medium text-primary dark:text-white leading-10">
                  {parentName}
                </div>
              </>

              <textarea
                className=" rounded-md h-fit p-2 outline-none resize-none w-full break-words"
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
                className="rounded-md h-fit p-2 outline-none resize-none w-full break-words focus:outline-primary"
                defaultValue={backText === "New Back Text" ? "" : backText}
                placeholder="Back Text"
                ref={backTextAreaRef}
                rows={1}
                onChange={handleChangeBack}
              />
            </div>
            <Button
              className="focus:outline dark:bg-primary dark:text-white focus:outline-primary  mt-4"
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
