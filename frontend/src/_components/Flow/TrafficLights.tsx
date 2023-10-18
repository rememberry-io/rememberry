import React from "react";

export const TrafficLights = () => {
  const colorCollection = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  const changeBorder = () => {};

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-opacity-10 flex flex-row justify-center gap-5 w-64">
      {colorCollection.map((colorClass, index) => (
        <button
          key={index}
          onClick={changeBorder}
          className={`w-7 h-7 rounded-full ${colorClass}`}
        ></button>
      ))}
    </div>
  );
};
