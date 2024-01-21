import { useState } from "react";

interface TrafficLightsProps {
  onColorChange?: (color: string) => void;
}

export const TrafficLights = ({ onColorChange }: TrafficLightsProps) => {
  const colorCollection = ["red-500", "orange-500", "yellow-500", "green-500"];

  const [isActive, setIsActive] = useState("default");

  const changeBorder = (color: string) => {
    setIsActive(color);
    onColorChange && onColorChange(color);
  };

  return (
    <div className="rounded-lg flex flex-col justify-center gap-2 ">
      {colorCollection.map((colorClass, index) => (
        <button
          key={index}
          onClick={() => changeBorder(colorClass)}
          className={`w-3 h-3 rounded-full bg-${colorClass}`}
        ></button>
      ))}
    </div>
  );
};
