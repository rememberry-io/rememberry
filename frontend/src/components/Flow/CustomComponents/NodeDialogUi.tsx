import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { FlowTextArea } from "./flowTextArea";

interface NodeDialogProps {
  frontside: string;
  backside: string;
  isDialogOpen: boolean;
  autoOpen?: boolean;
  closeDialog: () => void;
  onSubmit: (e: React.FormEvent) => void;
  discardChanges: () => void;
  changeFrontside: (input: string) => void;
  changeBackside: (input: string) => void;
}

export const NodeDialogUI: React.FC<NodeDialogProps> = ({
  frontside,
  backside,
  isDialogOpen,
  closeDialog,
  onSubmit,
  discardChanges,
  changeFrontside,
  changeBackside,
}) => {
  const frontsideAreaRef = useRef<HTMLTextAreaElement>(null);
  const backsideAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontsideAreaRef.current, frontside);
  useAutosizeTextArea(backsideAreaRef.current, backside);

  return (
    <Dialog open={isDialogOpen} onOpenChange={discardChanges}>
      <DialogContent onAbort={closeDialog}>
        <form onSubmit={onSubmit}>
          <div>
            <div>

              <FlowTextArea
                className=" "
                value={frontside}
                placeholder="Frontside"
                textAreaRef={frontsideAreaRef}
                rows={1}
                changes={(value: string) => changeFrontside(value)}
                isInput={true}
                onSubmit={() => onSubmit}
              />
            </div>

            <div className="leading-6 text-justify">
              <FlowTextArea
                className=" "
                value={backside}
                placeholder="Back Text"
                textAreaRef={backsideAreaRef}
                rows={1}
                changes={(value: string) => changeBackside(value)}
                isInput={true}
                onSubmit={() => onSubmit}
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
