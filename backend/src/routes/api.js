import express from "express";
import User from "../db/models/User.js"; // Adjust path as needed
import { verifyAuth } from "../middleware/verifyAuth.js"; // Your auth middleware

const router = express.Router();

router.get("/users/me", verifyAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("submissions") // This is crucial for calculating stats
            .select("-authId"); // Don't send the authId to the client

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error("Error fetching user profile:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get("/users/leaderboard", async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ rating: -1 }) // Sort by rating, descending
            .limit(10) // Get top 10
            .select("username rating avatarUrl"); // Only send public data

        res.json({ leaderboard });
    } catch (err) {
        console.error("Error fetching leaderboard:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;