import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // This field is crucial for linking to your auth provider
    // (e.g., Auth0 sub, Firebase UID, etc.)
    authId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 1200,
    },
    // Optional: for user profile avatars
    avatarUrl: {
      type: String,
    },
    // Useful for building a user's match history profile
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", // Links to the Room model
      },
    ],
    // Useful for building a user's submission history
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission", // Links to the Submission model
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

