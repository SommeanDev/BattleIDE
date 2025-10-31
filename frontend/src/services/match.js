import axios from "axios";

export async function fetchMatchProblem() {
    // Use relative path for proxy compatibility
    const response = await axios.get("http://localhost:4000/match");
    return response.data;
}
