import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNPQRSTUVWXYZ123456789", 6);

const RoomSchema = new mongoose.Schema(
  {
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "in_progress", "finished"],
      default: "waiting",
    },
    // This is the 6-digit code for sharing, e.g., "A4B2C"
    shareCode: {
      type: String,
      default: () => nanoid(),
      index: true,
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    startedAt: {
      type: Date,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);

