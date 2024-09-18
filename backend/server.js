const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;
const path = require("path");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

let socketList = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Socket
io.on("connection", (socket) => {
  console.log(`New User connected: ${socket.id}`);

  socket.on("BE-check-user", ({ roomId, userName }) => {
    console.log("Received BE-check-user", roomId, userName);
    let error = false;
    console.log("BE-check-user", roomId, userName);

    const clients = io.sockets.adapter.rooms.get(roomId);
    if (clients) {
      clients.forEach((clientId) => {
        if (socketList[clientId] === userName) {
          error = true;
        }
      });
    }

    socket.emit("FE-error-user-exist", { error });
  });

  socket.on("BE-join-room", ({ roomId, userName }) => {
    console.log("BE-join-room", roomId, userName);
    socket.join(roomId);
    socketList[socket.id] = { userName, video: true, audio: true };

    const clients = io.sockets.adapter.rooms.get(roomId);
    if (clients) {
      const users = Array.from(clients).map((clientId) => ({
        userId: clientId,
        info: socketList[clientId],
      }));
      socket.broadcast.to(roomId).emit("FE-user-join", users);
    }
  });

  socket.on("BE-call-user", ({ userToCall, from, signal }) => {
    io.to(userToCall).emit("FE-receive-call", {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on("BE-accept-call", ({ signal, to }) => {
    io.to(to).emit("FE-call-accepted", {
      signal,
      answerId: socket.id,
    });
  });

  socket.on("BE-send-message", ({ roomId, msg, sender }) => {
    io.sockets.in(roomId).emit("FE-receive-message", { msg, sender });
  });

  socket.on("BE-leave-room", ({ roomId }) => {
    delete socketList[socket.id];
    socket.broadcast.to(roomId).emit("FE-user-leave", { userId: socket.id });
    socket.leave(roomId);
  });

  socket.on("BE-toggle-camera-audio", ({ roomId, switchTarget }) => {
    if (switchTarget === "video") {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit("FE-toggle-camera", { userId: socket.id, switchTarget });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
