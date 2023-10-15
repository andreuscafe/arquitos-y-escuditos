const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://10.0.0.130:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const players = [];
const rooms = [];

const pastelColors = [
  "#ff8c82", // light pink
  "#ffb347", // light orange
  "#ffff99", // light yellow
  "#8affb7", // light green
  "#82c4ff", // light blue
  "#c49aec", // light purple
  "#ff99ac", // light red
  "#ffc2a1", // light peach
  "#d4e157", // light lime
  "#aed581" // light olive
];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);

    if (!rooms.includes(roomId)) {
      rooms.push(roomId);
    }

    if (!players.find((player) => player.id === socket.id)) {
      players.push({
        id: socket.id,
        coordinates: { x: 0, y: 0, itemRotation: 0 },
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        currentItem: "bow"
      });
    }

    io.sockets.in(roomId).emit("players", players);
  });

  socket.on("exit_room", (roomId) => {
    socket.leave(roomId);
    console.log(`user with id-${socket.id} left room - ${roomId}`);

    const index = players.findIndex((player) => player.id === socket.id);
    players.splice(index, 1);

    io.sockets.in(roomId).emit("players", players);

    if (players.length === 0) {
      const index = rooms.findIndex((room) => room === roomId);
      rooms.splice(index, 1);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    const index = players.findIndex((player) => player.id === socket.id);

    if (index !== -1) {
      players.splice(index, 1);
    }

    io.emit("players", players);
  });

  // game logic
  socket.on("send_coordinates", (data) => {
    // console.log(data, `COORDS of player ${socket.id}`);

    const index = players.findIndex((player) => player.id === socket.id);
    if (index === -1) {
      return;
    }
    players[index].coordinates = data.coordinates;

    io.sockets.in(data.roomId).emit("players", players);
  });

  socket.on("send_item", (data) => {
    console.log(data, `ITEM of player ${socket.id}`);

    const index = players.findIndex((player) => player.id === socket.id);
    if (index === -1) {
      return;
    }
    players[index].currentItem = data.currentItem;

    io.sockets.in(data.roomId).emit("players", players);
  });

  socket.on("game_start", (roomId) => {
    io.to(roomId).emit("game_start");
  });

  socket.on("game_end", (roomId) => {
    io.to(roomId).emit("game_end");
  });

  socket.on("game_restart", (roomId) => {
    io.to(roomId).emit("game_restart");
  });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    io.to(data.roomId).emit("receive_msg", data);
  });
});

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
