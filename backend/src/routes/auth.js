import express from "express";
import jwt from "jsonwebtoken";

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

export default router;
