import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dice({ socket }) {
  const [diceRoll, setDiceRoll] = useState(null);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    socket.emit("rollDice", roll);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <Button onClick={rollDice} className="p-2 bg-blue-500 text-white rounded">Roll Dice</Button>
      {diceRoll && <p className="mt-2 text-lg">You rolled: {diceRoll}</p>}
    </div>
  );
}
