import axios from "axios";

export async function fetchMatchProblem() {
    // Use relative path for proxy compatibility
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/match`);
    return response.data;
}
