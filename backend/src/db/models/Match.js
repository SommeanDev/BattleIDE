import mongoose from "mongoose";

const PlayerSub = new mongoose.Schema({
  userId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false 
  },
  username: String,
  rating: Number,
  socketId: String,
});

const MatchSchema = new mongoose.Schema({
  roomId: 
  { 
    type: String, 
    required: true, 
    unique: true 
  },
  players: 
  { 
    type: [PlayerSub], 
    required: true 
  },
  problems: 
  [
    { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Problem", required: true 
    }
  ],
  status: 
  { 
    type: String, 
    enum: ["pending", "active", "finished"], 
    default: "pending" 
  },
  startedAt: Date,
  finishedAt: Date,
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);