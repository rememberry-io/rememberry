import { useState } from "react";

interface TrafficLightsProps {
  onColorChange?: (color: ColorType) => void;
}

export const TrafficColor = {
  red: "red-500",
  orange: "orange-500",
  yellow: "yellow-500",
  green: "green-500",
} as const;

export type ColorType = keyof typeof TrafficColor;

export const TrafficLights = ({ onColorChange }: TrafficLightsProps) => {
  const [isActive, setIsActive] = useState("default");

  const changeBorder = (color: ColorType) => {
    setIsActive(color);
    onColorChange?.(color);
  };

  return (
    <div className="rounded-lg flex flex-col justify-center gap-2">
      {Object.keys(TrafficColor).map((colorClass, index) => {
        const backgroundStyle = "bg-" + TrafficColor[colorClass as ColorType];

        return (
          <button
            key={index}
            onClick={() => changeBorder(colorClass as ColorType)}
            className={`w-4 h-4 rounded-full ${backgroundStyle}`}
          ></button>
        );
      })}
    </div>
  );
};
