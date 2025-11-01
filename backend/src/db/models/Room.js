import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
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
    shareCode: {
        type: String,
        required: true,
        unique: true,
    },
    winnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    startedAt: {
        type: Date,
    },
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);

