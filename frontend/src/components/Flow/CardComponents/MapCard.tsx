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
      <div className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-3 w-64">
        <div className="flex gap-1">
          <button className="bg-red-500 rounded-full p-1">
            <X size="14" strokeWidth="3"  color="#7E0508" />
          </button>
          <button className="bg-yellow-500 rounded-full p-1">
            <PenLine size="14" strokeWidth="3"  color="#985712" />
          </button>
          <button className="bg-green-500 rounded-full p-1">
            <MoveDiagonal size="14" strokeWidth="3" color="#0B650D" />
          </button>
        </div>
        <div className=" text-primary text-2xl font-semibold">{map.name}</div>
        <hr/>
        <div className=" ">{map.description}</div>
      </div>
    </button>
  );
};

export default MapCard;
