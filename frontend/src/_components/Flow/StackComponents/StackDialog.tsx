import { Button } from "@/_components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/_components/ui/dialog";
import { Maximize2 } from "lucide-react";
import React, { useState } from "react";

interface StackDialogProps {
  stackFrontText: string;
  stackBackText: string;
}

export const StackDialog: React.FC<StackDialogProps> = ({
  stackFrontText,
  stackBackText,
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
        <DialogContent className="bg-blue-700">
          <div>
            <div className=" text-white font-semibold leading-10">
              {stackFrontText}
            </div>
            <div className="text-white leading-6 text-justify">
              {stackBackText}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
