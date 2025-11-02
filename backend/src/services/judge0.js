import axios from "axios";
import Room from "../db/models/Room.js";
import Submission from "../db/models/Submission.js";
import Problem from "../db/models/Problem.js";
import { emitMatchEnd, emitSubmissionLate, getSocketFromUserId } from "../socket.js";
import dotenv from "dotenv";
dotenv.config();

const JUDGE0_URL = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";

const JUDGE0_HEADERS = { "Content-Type": "application/json" };
if (process.env.JUDGE0_KEY) JUDGE0_HEADERS["X-RapidAPI-Key"] = process.env.JUDGE0_KEY;
if (process.env.JUDGE0_HOST) JUDGE0_HEADERS["X-RapidAPI-Host"] = process.env.JUDGE0_HOST;

async function createJudge0Submission(submission) {
  console.log("SUBMISSION",submission)
  const problem = await Problem.findById(submission.problemId);
  if (!problem) throw new Error("Problem not found");

  
  const submissions = problem.examples.map((testCase) => ({
    source_code: submission.code,
    language_id: getLanguageId(submission.language),
    stdin: testCase.input,
    expected_output: testCase.output,
  }));

  // console.log("sadasdasd",submissions);
  
  
  const url = `${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=false`;
  const res = await axios.post(url, { submissions }, { headers: JUDGE0_HEADERS });
  // console.log("responseeee",res);
  
  return res.data;
}

function pollJudge0Submissions(tokens) {
  return new Promise((resolve, reject) => {
    let pollCount = 0;
    const maxPolls = 20;
    const interval = 2000;

    const tokenString = tokens.map(t => t.token).join(',');
    const url = `${JUDGE0_URL}/submissions/batch?tokens=${tokenString}&base64_encoded=false&fields=status_id,stdout,stderr,expected_output,compile_output`;

    const poll = setInterval(async () => {
      if (pollCount > maxPolls) {
        clearInterval(poll);
        return reject(new Error("Judge0 polling timed out."));
      }
      pollCount++;

      try {
        const res = await axios.get(url, { headers: JUDGE0_HEADERS });
        const results = res.data.submissions;

        const allFinished = results.every(r => r.status_id !== 1 && r.status_id !== 2);

        if (allFinished) {
          clearInterval(poll);
          resolve(results);
        }
      } catch (err) {
        clearInterval(poll);
        reject(err);
      }
    }, interval);
  });
}

function getFinalStatus(results) {
  let finalStatus = "Accepted";

  for (const res of results) {
    if (res.status_id === 6) {
      finalStatus = "Compilation Error";
      break;
    }
    if (res.status_id === 5) {
      finalStatus = "Time Limit Exceeded";
      break;
    }
    if (res.status_id === 4) {
      finalStatus = "Wrong Answer";
      break;
    }
    if (res.status_id > 6) {
      finalStatus = "Runtime Error";
      break;
    }
  }
  return finalStatus;
}

export async function processMatchSubmission(submissionId,userId) {
  try {
    
    const submission = await Submission.findById(submissionId);
    console.log("SAHDASHIASHD",submission);
    
    if (!submission) return;

    const tokens = await createJudge0Submission(submission);

    submission.judge0Token = tokens.map(t => t.token).join(',');
    await submission.save();

    const results = await pollJudge0Submissions(tokens);

    const finalStatus = getFinalStatus(results);
    submission.status = finalStatus;
    console.log("SUBMISSION BACKEED",submission);
    
    await submission.save();

    if (finalStatus !== "Accepted") {
      return submission;
    }

    const room = await Room.findById(submission.roomId);
    if (!room) return;

    if (room.status !== "in_progress") {
      const socket = getSocketFromUserId(submission.userId.toString());
      if (socket) {
        emitSubmissionLate(socket.id, "Your solution was correct, but the match is already over!");
      }
      return;
    }

    const winningUpdate = await Room.findOneAndUpdate(
      { _id: submission.roomId, status: "in_progress" },
      {
        status: "finished",
        winnerId: submission.userId,
        finishedAt: new Date()
      },
      { new: true }
    ).populate('players problemId');

    if (winningUpdate) {
      emitMatchEnd(submission.roomId.toString(), submission.userId.toString(), winningUpdate);

      await Submission.updateMany(
        { roomId: submission.roomId, status: "Pending", _id: { $ne: submission._id } },
        { status: "Wrong Answer" }
      );
    }

    return submission;
  } catch (err) {
    console.error("Error processing submission:", err.message);
    try {
      await Submission.findByIdAndUpdate(submissionId, { status: "Runtime Error" });
    } catch (dbErr) {
      console.error("Error updating submission status after failure:", dbErr.message);
    }
  }
}

function getLanguageId(language) {
  const map = {
    java: 62,
    python: 71,
    javascript: 63,
  };
  return map[language] || 71;
}

