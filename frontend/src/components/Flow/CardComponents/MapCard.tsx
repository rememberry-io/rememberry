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
  handleToggleDialog: (open: boolean) => void; // Added the missing property
}

const MapCard: React.FC<MapCardProps> = ({ map, handleToggleDialog }) => {
  const [name, setName] = useState(map.name);
  const [description, setDescription] = useState(map.description);

  const [menuZoom, setMenuZoom] = useState(false);

  const openZoomDialog = () => {
    handleToggleDialog(true); // This opens the dialog
  };

  const closeZoomDialog = () => {
    handleToggleDialog(false); // This closes the dialog
  };
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(descriptionRef.current, description);

  return (
    //TODO: Logic for zooming,  renaming dialog not adding & deleting the dialog

    <div className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-3 w-72">
      <div className="flex gap-1">
        <button className="bg-red-500 rounded-full p-1">
          <X size="12" strokeWidth="3" color="#7E0508" />
        </button>
        <button className="bg-yellow-500 rounded-full p-1">
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
        <div className="flex flex-col  justify-center  m-4 -mt-1">
          <div
            title={map.name}
            className=" text-primary text-xl font-semibold overflow-ellipsis line-clamp-1 title={map.name} "
          >
            {map.name}
          </div>
          <hr className="m-2" />
          <textarea className=" line-clamp-2 linebreak overflow-ellipsis resize-none text-center ">
            {map.description}
          </textarea>
        </div>
      </Link>
    </div>
  );
};

export default MapCard;
