import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCreateMap from "@/lib/services/maps/useCreateMap";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { FlowTextArea } from "./flowTextArea";

interface MapDialogProps {
  userID: string;
  mapID: string;
  isDialogOpen: boolean;
  closeDialog: () => void;
  mapName: string;
  mapDescription: string;
  onSubmit: (name: string, description: string) => void;
  isAddingactive: boolean;
  isEditingActive: boolean;
  isZoomActive: boolean;
  toggleEditMode: (open: boolean) => void;
}

export const MapDialog: React.FC<MapDialogProps> = ({
  userID,
  mapID,
  isDialogOpen,
  closeDialog,
  mapName,
  mapDescription,
  onSubmit,
  isAddingactive,
  isEditingActive,
  isZoomActive,
  toggleEditMode,
}) => {
  const [userId, setUserId] = useState(userID);
  const [mapId, setMapId] = useState(mapID);
  const [name, setName] = useState(mapName);
  const [description, setDescription] = useState(mapDescription);

  const createMap = useCreateMap();
  const router = useRouter();

  const handleSubmit = () => {
    onSubmit(name, description);
    closeDialog();
  };

  const discardChanges = () => {
    setName(mapName);
    setDescription(mapDescription);
    closeDialog();
  };

  const nameAreaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(nameAreaRef.current, name);
  useAutosizeTextArea(descriptionAreaRef.current, description);

  const handleChangeFront = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valFront = evt.target?.value;

    setName(valFront);
  };

  const handleChangeBack = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valBack = evt.target?.value;

    setDescription(valBack);
  };

  useEffect(() => {
    if (isZoomActive) {
      setName(mapName);
      setDescription(mapDescription);
    }
  }, [isZoomActive, mapName, mapDescription]);

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={discardChanges}>
        <DialogContent onAbort={discardChanges}>
          <div>
            <div>
              {isAddingactive && (
                <h1 className="text-2xl font-medium max-w-xl text-blackberry dark:text-white">
                  What do you want to call it?
                </h1>
              )}
              {isEditingActive && (
                <h1 className="text-2xl font-medium max-w-xl text-blackberry dark:text-white">
                  Make your changes:
                </h1>
              )}
              <div
                onClick={() => {
                  if (isZoomActive) toggleEditMode(true);
                }}
              >
                <FlowTextArea
                  value={name}
                  textAreaRef={nameAreaRef}
                  placeholder={"Map Name"}
                  className=""
                  rows={1}
                  changes={(value: string) => setName(value)}
                  readOnly={!isEditingActive}
                  isStack={false}
                  isInput={true}
                  onSubmit={handleSubmit}
                />
                <FlowTextArea
                  value={description}
                  textAreaRef={descriptionAreaRef}
                  placeholder={"Description"}
                  className=""
                  rows={1}
                  changes={(value: string) => setDescription(value)}
                  readOnly={!isEditingActive}
                  isStack={false}
                  isInput={true}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            <div className="leading-6 text-justify"></div>
            {isEditingActive && (
              <Button className="mt-4" onClick={handleSubmit}>
                Save
              </Button>
            )}
            {isAddingactive && (
              <Button
                className="mt-4"
                onClick={async () => {
                  if (userId) {
                    const [_err, map] = await createMap({
                      map: {
                        name,
                        description,
                        userId: userId,
                      },
                    });

                    closeDialog();

                    if (map && isAddingactive) {
                      router.push("/map/" + map.id);
                    }
                  } else {
                    console.error("no user");
                  }
                }}
              >
                Save
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
