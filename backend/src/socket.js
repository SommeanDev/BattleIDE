import { Server } from "socket.io";
import Room from "./db/models/Room.js";

let io;
const userToSocketMap = new Map();

export function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id);

    // Map userId <-> socket for private events
    const userId = socket.handshake.query.userId;
    if (userId) {
      userToSocketMap.set(userId, socket);
      console.log(`👤 User ${userId} mapped to socket ${socket.id}`);
    }

    // 🧩 When a user joins a room
socket.on("join_room", async ({ roomId, userId }) => {
  console.log(`📥 Socket ${socket.id} (User ${userId}) joining room ${roomId}`);
  socket.join(roomId);

  // Notify everyone else (except the joining socket)
  socket.to(roomId).emit("player_joined", { roomId, joinedBy: userId });
});



    // 🧹 Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      userToSocketMap.forEach((value, key) => {
        if (value.id === socket.id) {
          userToSocketMap.delete(key);
          console.log(`🧹 Removed user ${key} from socket map`);
        }
      });
    });
  });
}

// Helper to find socket by userId
export function getSocketFromUserId(userId) {
  return userToSocketMap.get(userId);
}

// Emit events for match lifecycle
export function emitMatchStart(roomId, roomData) {
  console.log(`🚀 Emitting match_start to room ${roomId}`);
  io.to(roomId).emit("match_start", { room: roomData });
}

export function emitMatchEnd(roomId, winnerId, roomData) {
  console.log(`🏁 Emitting match_end to room ${roomId}`);
  io.to(roomId).emit("match_end", { winnerId, room: roomData });
}

export function emitSubmissionLate(socketId, message) {
  console.log(`⏰ Emitting submission_accepted_late to socket ${socketId}`);
  io.to(socketId).emit("submission_accepted_late", { message });
}
