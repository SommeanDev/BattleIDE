import express from "express";
import Room from "../db/models/Room.js";
import Problem from "../db/models/Problem.js";
import { verifyAuth } from "../middleware/verifyAuth.js"; // You need this
import { getSocketFromUserId, emitMatchStart } from "../socket.js";
import User from "../db/models/User.js";

const router = express.Router();

// GET /match/:roomId
// Fetches the initial data for a room
router.get("/:roomId", verifyAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate("problemId");
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ room });
  } catch (err) {
    console.error("Error fetching room:", err.message);
    res.status(500).json({ error: "Error fetching room" });
  }
});

// POST /match/create
// Creates a new room for a match
router.post("/create", verifyAuth, async (req, res) => {
  const userId = req.user.id;
  console.log("here is ", userId);

  try {
    // 1. Get a random problem (e.g., "Easy" one)
    // In a real app, you'd filter by difficulty
    const problem = await Problem.findOne(); // Finds one problem
    console.log("Selected problem:", problem);
    if (!problem) {
      return res.status(500).json({ error: "No problems available" });
    }

    // 2. Create the room
    console.log("asdasdasd", userId);

    const newRoom = await Room.create({
      players: [userId],
      problemId: problem._id,
      status: "waiting",
      shareCode: generateShareCode(),
      // 'startedAt' and 'winnerId' are left empty
    });
    await User.findByIdAndUpdate(userId, {
      $push: { matches: newRoom._id },
    });
    console.log("Room created:", newRoom);

    res.status(201).json({ roomId: newRoom._id, shareCode: newRoom.shareCode });
  } catch (err) {
    console.error("Error creating room:", err.message);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// POST /match/join
// Joins an existing room using a share code
router.post("/join", verifyAuth, async (req, res) => {
  const userId = req.user.id;
  const { shareCode } = req.body;

  if (!shareCode) {
    return res.status(400).json({ error: "Share code required" });
  }

  try {
    // 1. Find the room by its share code and 'waiting' status
    const room = await Room.findOne({
      shareCode: shareCode.toUpperCase(),
      status: "waiting",
    });

    if (!room) {
      return res.status(404).json({ error: "Invalid or full room code" });
    }

    // 2. Check if user is already in the room
    if (room.players.includes(userId)) {
      return res.status(400).json({ error: "Already in this room" });
    }

    // 3. Add the second player and start the match
    room.players.push(userId);
    room.status = "in_progress";
    room.startedAt = new Date();
    await room.save();

    // 4. Notify both players via WebSocket that the match has started
    const hostSocket = getSocketFromUserId(room.players[0]); // Get host socket
    if (hostSocket) {
      emitMatchStart(hostSocket, room); // Notify host
    }
    emitMatchStart(userId, room); // Notify joiner

    res.json({ roomId: room._id });
  } catch (err) {
    console.error("Error joining room:", err.message);
    res.status(500).json({ error: "Failed to join room" });
  }
});

function generateShareCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default router;

