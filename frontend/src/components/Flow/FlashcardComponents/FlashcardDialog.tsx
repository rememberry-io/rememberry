import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import React, { useState } from "react";

interface FlashcardDialogProps {
  nodeId: string;
  flashcardCategory: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  backText: string;
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
  const [frontText, setFront] = useState(flashcardFrontText);
  const [backText, setBackText] = useState(flashcardBackText);

  const handleSubmit = () => {
    onSubmit(frontText, backText, category); // Pass the updated values back
    closeDialog();
  };

  const openDialog = () => {
    setIsOpen(true);
  };
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="" onClick={openDialog}>
            <Maximize2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div>
            <div>
              <div className="font-medium text-primary leading-10">
                {flashcardCategory}
              </div>
              <div className="font-semibold leading-10">
                <input
                  className="w-full text-justify p-2 rounded-md focus:bg-gray-100 focus:outline-none"
                  type="text"
                  defaultValue={frontText}
                  onChange={(e) => setFront(e.target.value)}
                ></input>
              </div>
              <hr className="m-2"/> 
              <div className="leading-6 text-justify">
                <input
                  className="w-full text-justify p-2 rounded-md focus:bg-gray-100 focus:outline-none"
                  type="text"
                  defaultValue={backText}
                  onChange={(e) => setBackText(e.target.value)}
                ></input>
              </div>
              <Button className="ml-2  mt-4" onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
