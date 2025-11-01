import express from "express";
import Submission from "../db/models/Submission.js";
import { processMatchSubmission } from "../services/judge0.js";
import { verifyAuth } from "../middleware/verifyAuth.js"; // You need to create this auth middleware

const router = express.Router();

// POST /submit
// This is the main route for the "Submit Match" button
router.post("/", verifyAuth, async (req, res) => {
  const { code, language, problemId, roomId } = req.body;
  const userId = req.user.id; // Get user ID from verifyAuth middleware

  if (!code || !language || !problemId || !roomId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Create the Submission document
    const submission = await Submission.create({
      userId,
      problemId,
      roomId,
      code,
      language,
      status: "Pending", // Initial status
    });

    // 2. Start the judging process (asynchronously)
    // We don't 'await' this, so we can respond to the user immediately.
    processMatchSubmission(submission, userId);

    // 3. Respond to user immediately
    res.status(202).json({
      message: "Submission received. Running tests...",
      submissionId: submission._id,
    });
  } catch (err) {
    console.error("Error creating submission:", err.message);
    res.status(500).json({ error: "Failed to create submission" });
  }
});

export default router;

