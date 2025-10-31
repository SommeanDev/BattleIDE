import axios from "axios";

export async function submitToJudge0({ source_code, language_id = 71, stdin = "" }) {
  // JUDGE0_URL should NOT have a trailing slash, e.g. https://judge0-ce.p.rapidapi.com
  const base = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
  const url = `${base}/submissions?base64_encoded=false&wait=true`;

  const headers = { "Content-Type": "application/json" };
  // If you're using RapidAPI-hosted Judge0 set these in .env:
  // JUDGE0_KEY and JUDGE0_HOST
  if (process.env.JUDGE0_KEY) headers["X-RapidAPI-Key"] = process.env.JUDGE0_KEY;
  if (process.env.JUDGE0_HOST) headers["X-RapidAPI-Host"] = process.env.JUDGE0_HOST;

  const body = { source_code, language_id, stdin };

  const resp = await axios.post(url, body, { headers, timeout: 20000 });
  return resp.data;
}
