import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error"],
        default: "Pending",
    },
    judge0Token: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);

