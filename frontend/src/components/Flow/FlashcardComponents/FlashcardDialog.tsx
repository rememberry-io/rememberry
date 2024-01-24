import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface FlashcardDialogProps {
  nodeId: string;
  flashcardCategory: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  onSubmit: (frontText: string, backText: string, category: string) => void;
}

export const FlashcardDialog: React.FC<FlashcardDialogProps> = ({
  nodeId,
  flashcardCategory,
  flashcardFrontText,
  flashcardBackText,
  onSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [category, setCategory] = useState(flashcardCategory);
  const [frontText, setFrontText] = useState(flashcardFrontText);
  const [backText, setBackText] = useState(flashcardBackText);

  const handleSubmit = () => {
    onSubmit(frontText, backText, category); 
    closeDialog();
  };

  const openDialog = () => {
    setIsOpen(true);
  };
  const closeDialog = () => {
    setIsOpen(false);
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
      <Dialog open={isOpen}  >
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className=""
            onClick={openDialog}
          >
            <Maximize2 />
          </Button>
        </DialogTrigger>
        <DialogContent onAbort={handleSubmit}>
          <div>
            <div>
              <div className="font-medium text-primary leading-10">
                {category}
              </div>
              <textarea
                className=" rounded-md h-fit outline-none resize-none w-full break-words"
                defaultValue={frontText}
                placeholder="Front Text"
                ref={frontTextAreaRef}
                rows={1}
                onChange={handleChangeFront}
              />
            </div>
            <hr className="m-2" />
            <div className="leading-6 text-justify">
              <textarea
                className="rounded-md h-fit outline-none resize-none w-full break-words"
                defaultValue={backText}
                placeholder="Back Text"
                ref={backTextAreaRef}
                rows={1}
                onChange={handleChangeBack}
              />
            </div>
            <Button className="ml-2  mt-4" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
