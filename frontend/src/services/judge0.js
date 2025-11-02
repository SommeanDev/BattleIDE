import axios from "axios";

export async function runCodeOnJudge0({ source_code, language_id, stdin }) {
  const JUDGE0_URL = import.meta.env.VITE_JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
  const url = `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`;

  const headers = { "Content-Type": "application/json" };

  if (import.meta.env.VITE_JUDGE0_KEY) {
    headers["X-RapidAPI-Key"] = import.meta.env.VITE_JUDGE0_KEY;
  }
  if (import.meta.env.VITE_JUDGE0_HOST) {
    headers["X-RapidAPI-Host"] = import.meta.env.VITE_JUDGE0_HOST;
  }

  const body = { source_code, language_id, stdin };
  
  try {
    const resp = await axios.post(url, body, { headers, timeout: 20000 });
    return resp.data;
  } catch (err) {
    console.error("Frontend Judge0 error:", err?.response?.data || err.message);
    if (err.response) {
      return { error: err.response.data.error || "Submission failed", details: err.response.data.message };
    }
    return { error: "Submission failed", details: err.message };
  }
}

