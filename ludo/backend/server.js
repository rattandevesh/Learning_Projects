const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let players = [];
const boardSize = 52;

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  players.push({ id: socket.id, position: 0 });
  io.emit("playerJoined", players);

  socket.on("rollDice", (roll) => {
    const player = players.find((p) => p.id === socket.id);
    if (player) {
      player.position = (player.position + roll) % boardSize;
      io.emit("diceRolled", { player: socket.id, roll, position: player.position });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    players = players.filter((player) => player.id !== socket.id);
    io.emit("playerJoined", players);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
