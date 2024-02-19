import { MoveDiagonal, PenLine, X } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface MapCardProps {
  map: {
    name: string;
    description: string;
    id: string;
  };
  handleZoomDialog: (open: boolean) => void;
  handleToggleDialog: (open: boolean) => void;
  handleMapId: (id: string) => void;
  handleEditDialog: (open: boolean) => void;
}

const MapCard: React.FC<MapCardProps> = ({
  map,
  handleToggleDialog,
  handleZoomDialog,
  handleMapId,
  handleEditDialog,
}) => {
  const [name, setName] = useState(map.name);
  const [description, setDescription] = useState(map.description);

  const [menuZoom, setMenuZoomr] = useState(false);

  const openZoomDialog = () => {
    handleToggleDialog(true);
    handleZoomDialog(true);
    console.log("zoom");
  };
  const editDialog = () => {
    handleToggleDialog(true);
    handleEditDialog(true);
    console.log("edit");
  };

  const closeZoomDialog = () => {
    handleToggleDialog(false);
  };
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(descriptionRef.current, description);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card dark:bg-dark-800 text-card-foreground shadow-sm p-3 w-72">
      <div className="flex gap-1">
        <button className="bg-red-500 rounded-full p-1">
          <X size="12" strokeWidth="3" color="#7E0508" />
        </button>
        <button className="bg-yellow-500 rounded-full p-1" onClick={editDialog}>
          <PenLine size="12" strokeWidth="3" color="#985712" />
        </button>
        <button
          className="bg-green-500 rounded-full p-1"
          onClick={openZoomDialog}
        >
          <MoveDiagonal size="12" strokeWidth="3" color="#0B650D" />
        </button>
      </div>
      <Link href={"/map/" + map.id}>
        <div className="flex flex-col   justify-center items-center m-4">
          <div
            title={map.name}
            className=" text-primary text-xl font-semibold overflow-ellipsis line-clamp-1 "
          >
            {map.name}
          </div>

          <div title={map.description} className="dark:bg-dark-800">
            <textarea className=" outline-none focus-visible:hidden focus:ring-0 focus:ring-offset-0 focus:hidden  line-clamp-2 dark:bg-dark-800  mt-2 linebreak overflow-ellipsis resize-none text-center ">
              {map.description}
            </textarea>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MapCard;
