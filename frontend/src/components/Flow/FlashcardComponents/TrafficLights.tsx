import { useState } from "react";

interface TrafficLightsProps {
  onColorChange?: (color: string) => void;
}

export const TrafficLights = ({ onColorChange }: TrafficLightsProps) => {
  const colorCollection = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  const [isActive, setIsActive] = useState("default");

  const changeBorder = (color: string) => {
    setIsActive(color);
    onColorChange && onColorChange(color);
  };

  return (
    <div className="rounded-lg flex flex-col justify-center gap-2">
      {colorCollection.map((colorClass, index) => (
        <button
          key={index}
          onClick={() => changeBorder(colorClass)}
          className={`w-4 h-4 rounded-full ${colorClass}`}
        ></button>
      ))}
    </div>
  );
};
