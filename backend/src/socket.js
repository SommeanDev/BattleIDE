import { Server } from "socket.io";

let io;
const queue = []; // simple FIFO queue of sockets waiting for match

export function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("join-queue", ({ username, rank }) => {
      console.log(`${username} joined queue`);
      // if someone waiting, pair them
      const waiting = queue.shift();
      if (waiting && waiting.id !== socket.id) {
        const roomId = `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        socket.join(roomId);
        waiting.join(roomId);

        // send match-found to both
        io.to(waiting.id).emit("match-found", {
          roomId,
          opponent: { username, rank: rank || "Bronze" },
        });

        io.to(socket.id).emit("match-found", {
          roomId,
          opponent: { username: waiting.data.username, rank: waiting.data.rank },
        });

        console.log("matched", waiting.data.username, "with", username);
      } else {
        // store socket and some metadata
        queue.push({ id: socket.id, socket, data: { username, rank } });
        // optional: ack back
        socket.emit("queued");
      }
    });

    socket.on("leave-queue", () => {
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].id === socket.id) {
          queue.splice(i, 1);
          break;
        }
      }
      socket.emit("left-queue");
    });

    socket.on("disconnect", () => {
      // remove from queue on disconnect
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].id === socket.id) {
          queue.splice(i, 1);
          break;
        }
      }
      console.log("socket disconnected:", socket.id);
    });
  });
}
