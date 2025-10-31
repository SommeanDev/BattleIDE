import express from "express";
import Problem from "../db/models/Problems.js";
const router = express.Router();

// GET /match - fetch a problem from the DB
router.get("/", async (req, res) => {
  try {
    const problem = await Problem.findOne();
    console.log("Problem fetched from DB:", problem);
    if (!problem) return res.status(404).json({ error: "No problem found" });
    res.json(problem);
    console.log("Fetched problem:", problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem", details: err.message });
  }
});

export default router;