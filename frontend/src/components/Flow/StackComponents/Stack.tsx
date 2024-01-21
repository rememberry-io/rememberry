import React from "react";
import { Handle, Position } from "reactflow";

interface StackProps {
  data: {
    frontText: string;
  };
}

export const Stack: React.FC<StackProps> = ({ data }) => {
  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="flex text-center flex-col p-5 rounded-md bg-primary text-white justify-center ">
          <div className="line-clamp-3">{data.frontText}</div>
        </div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            placeSelf: "center",
            height: "0.75rem",
            width: "0.75rem",
            background: "#C4C9D6",
            borderRadius: "0.25rem",
          }}
        />
      </div>
    </div>
  );
};
