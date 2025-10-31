import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  rating: { type: Number, default: 1200 },
  // other profile fields...
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);