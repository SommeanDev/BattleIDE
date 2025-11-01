import axios from "axios";

// Get the backend URL from Vite's env variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Helper to create auth headers
 * @param {string} token - The Clerk JWT
 */
const getAuthHeaders = (token) => {
  console.log("--- DEBUG: Using UPDATED api.js file ---");
  console.log("Token received from component:", token ? "A token was provided" : "Token is NULL or UNDEFINED");

  // This will prove the file is updated.
  // If the token is null, we send a fake one.
  // The backend error should change from "No token" to "Unauthenticated"
  const fakeToken = "THIS_IS_A_FAKE_TOKEN_FOR_DEBUGGING";

  return {
    headers: {
      // Use the real token if it exists, otherwise use the fake one for the test
      Authorization: `Bearer ${token || fakeToken}`,
      "X-Debug-Header": "api-js-was-reloaded" // You can check for this header in the Network tab
    },
  };
};


// --- Home.jsx Functions ---

/**
 * Creates a new match room
 * @param {string} token - The Clerk JWT
 */
export const createRoom = async (token) => {
  if (!token) {
    // This log will now appear in your browser console if Home.jsx is the problem
    console.error("API Error: createRoom called without a token.");
  }
  const res = await apiClient.post(
    "/match/create",
    {}, // No body needed
    getAuthHeaders(token)
  );
  return res; // Return the full response so Home.jsx can get res.data
};

/**
 * Joins an existing room by its share code
 * @param {string} shareCode - The 6-digit room code
 * @param {string} token - The Clerk JWT
 */
export const joinRoomByCode = async (shareCode, token) => {
  if (!token) {
    console.error("API Error: joinRoomByCode called without a token.");
  }
  const res = await apiClient.post(
    "/match/join",
    { shareCode },
    getAuthHeaders(token)
  );
  return res; // Return the full response
};

// --- Battle.jsx Functions ---

/**
 * Gets the details for a specific room
 * @param {string} roomId - The room's MongoDB _id
 * @param {string} token - The Clerk JWT
 */
export const getRoom = async (roomId, token) => {
  if (!token) {
    console.error("API Error: getRoom called without a token.");
  }
  const res = await apiClient.get(`/match/${roomId}`, getAuthHeaders(token));
  return res; // Return the full response
};

/**
 * Submits the final solution for judging
 * @param {object} payload - { code, language, problemId, roomId, token }
 */
export const submitFinalSolution = async ({
  code,
  language,
  problemId,
  roomId,
  token,
}) => {
  if (!token) {
    console.error("API Error: submitFinalSolution called without a token.");
  }
  const res = await apiClient.post(
    "/submit",
    {
      code,
      language,
      problemId,
      roomId,
    },
    getAuthHeaders(token)
  );
  return res; // Return the full response
};

