import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = config.headers.Authorization;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getRoom = (roomId, token) => {
    return apiClient.get(`/match/${roomId}`, {
        headers: { Authorization: token },
    });
};

export const createRoom = (token) => {
    
    return apiClient.post("/match/create", null, {
        headers: { Authorization: token },
    });
};

export const joinRoomByCode = (shareCode, token) => {
    return apiClient.post("/match/join", { shareCode }, {
        headers: { Authorization: token },
    });
};

export const submitFinalSolution = ({ code, language, problemId, roomId, token }) => {
    return apiClient.post(
        "/submit",
        { code, language, problemId, roomId },
        {
            headers: { Authorization: token },
        }
    );
};

