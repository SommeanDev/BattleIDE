import express from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// POST /auth/login
// body: { username }
router.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username required" });

  // for PoC we don't persist users — just sign a token
  const payload = { username, rank: "Bronze" };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

  res.json({ token, user: payload });
});


router.get("/by-auth/:authId", async (req, res) => {
  try {
    const user = await User.findOne({ authId: req.params.authId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ _id: user._id, name: user.username ,avatarUrl:user.avatarUrl});
  } catch (error) {
    console.error("Error fetching user by authId:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/winner/:winnerId", async (req, res) => {
  try {
    const user = await User.findById(req.params.winnerId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add 100 to user's rating (initialize to 0 if undefined)
    user.rating = (user.rating || 0) + 100;
    await user.save();

    res.json({
      _id: user._id,
      name: user.username,
      newRating: user.rating,
    });
  } catch (error) {
    console.error("Error fetching/updating user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getuser/:userId",async(req,res)=>{
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      _id: user._id,
      name: user.username,
      avatarUrl:user.avatarUrl
    });
  } catch (error) {
    console.error("Error fetching/updating user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
})

export default router;
