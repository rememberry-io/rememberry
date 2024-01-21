import { useState } from "react";

export const TrafficLights = () => {
  const colorCollection = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  const borderColors = {
    default: "border border-opacity-10",
    red: "border red-500",
    orange: "border orange-500",
    yellow: "border yellow-500",
    green: "border green-500",
  };

  const [isActive, setIsActive] = useState("default");

  const changeBorder = () => {};

  return (
    <div className="  rounded-lg flex flex-col justify-center gap-2 ">
      {colorCollection.map((colorClass, index) => (
        <button
          key={index}
          onClick={changeBorder}
          className={`w-3 h-3 rounded-full ${colorClass}`}
        ></button>
      ))}
    </div>
  );
};
