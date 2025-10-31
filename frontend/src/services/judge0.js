import axios from "axios";

export async function submitCode({ source_code, language_id, stdin }) {
  // Calls backend /submit endpoint
  const url = "http://localhost:4000/submit";
  try {
    const resp = await axios.post(url, { source_code, language_id, stdin });
    return resp.data;
  } catch (err) {
    // Return error details for UI
    return { error: err?.response?.data?.error || err.message, details: err?.response?.data?.details };
  }
}
