import { Button } from "@/_components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/_components/ui/dialog";
import { Maximize2 } from "lucide-react";
import React, { useState } from "react";

interface FlashcardDialogProps {
  flashcardCategory: string;
  flashcardFrontText: string;
  flashcardBackText: string;
}

export const FlashcardDialog: React.FC<FlashcardDialogProps> = ({
  flashcardCategory,
  flashcardFrontText,
  flashcardBackText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* <Dialog isOpen={openDialog} onDismiss={closeDialog}> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="ml-4">
            <Maximize2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div>
            <div>
              <div className="text-sm text-blue-500 leading-10">
                {flashcardCategory}
              </div>
              <div className="font-semibold leading-10">
                {flashcardFrontText}
              </div>
              <div className="leading-6 text-justify">{flashcardBackText}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
