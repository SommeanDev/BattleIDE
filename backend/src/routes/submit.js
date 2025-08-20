import express from "express";
import { submitToJudge0 } from "../services/judge0.js";

const router = express.Router();

// POST /submit
// body: { source_code, language_id, stdin }
router.post("/", async (req, res) => {
  const { source_code, language_id, stdin } = req.body;
  if (!source_code) return res.status(400).json({ error: "source_code required" });

  try {
    const data = await submitToJudge0({ source_code, language_id, stdin });
    // data contains Judge0 response (stdout, stderr, status, etc.)
    res.json(data);
  } catch (err) {
    console.error("Judge0 error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Judge0 submission failed", details: err?.message });
  }
});

export default router;
