import { MoveDiagonal, PenLine, X } from "lucide-react";
import React from "react";

interface MapCardProps {
  map: {
    name: string;
    description: string;
  };
}

const MapCard: React.FC<MapCardProps> = ({ map }) => {
  return (
    <button>
      <div className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-3 w-72">
        <div className="flex gap-1">
          <button className="bg-red-500 rounded-full p-1">
            <X size="12" strokeWidth="3" color="#7E0508" />
          </button>
          <button className="bg-yellow-500 rounded-full p-1">
            <PenLine size="12" strokeWidth="3" color="#985712" />
          </button>
          <button className="bg-green-500 rounded-full p-1">
            <MoveDiagonal size="12" strokeWidth="3" color="#0B650D" />
          </button>
        </div>
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
      </div>
    </button>
  );
};

export default MapCard;
