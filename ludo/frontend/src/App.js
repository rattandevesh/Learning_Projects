import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import LudoBoard from "./components/LudoBoard";
import Dice from "./components/Dice";
import "tailwindcss/tailwind.css";

const socket = io("http://localhost:5000");

export default function App() {
  const [players, setPlayers] = useState([]);
  const [playerPositions, setPlayerPositions] = useState({});
  const [diceRoll, setDiceRoll] = useState(null);

  useEffect(() => {
    socket.on("playerJoined", (newPlayers) => {
      setPlayers(newPlayers);
      const positions = {};
      newPlayers.forEach(player => {
        positions[player.id] = player.position;
      });
      setPlayerPositions(positions);
    });

    socket.on("diceRolled", ({ player, roll, position }) => {
      setDiceRoll(roll);
      setPlayerPositions(prev => ({ ...prev, [player]: position }));
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Ludo Game</h1>
      <LudoBoard playerPositions={playerPositions} />
      <Dice socket={socket} />
      {diceRoll && <p className="mt-4 text-lg">Last Roll: {diceRoll}</p>}
    </div>
  );
}
