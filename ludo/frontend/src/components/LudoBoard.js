import React from "react";

export default function LudoBoard({ playerPositions }) {
  const boardSize = 52;
  return (
    <div className="grid grid-cols-13 gap-1 border-4 border-black mt-4 w-80 h-80">
      {Array.from({ length: boardSize }).map((_, index) => (
        <div
          key={index}
          className="border border-gray-700 w-full h-full flex items-center justify-center"
        >
          {Object.entries(playerPositions).map(([id, pos]) =>
            pos === index ? <span key={id} className="text-red-500">🔴</span> : null
          )}
        </div>
      ))}
    </div>
  );
}
