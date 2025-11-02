import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { useSocket } from '../context/SocketContext';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from "axios"
import { getRoom, submitFinalSolution } from "../services/api";
import { runCodeOnJudge0 } from "../services/judge0";
import SAMPLE_CODE_MAP from "../constants/sampleCodeMap";

const LANGUAGE_OPTIONS = [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
];

const LANGUAGE_ID_MAP = {
    java: 62,
    python: 71,
    javascript: 63,
};

export default function Battle() {
    const { roomId } = useParams();
    // Add isLoaded check from useAuth
    const { getToken, userId: myUserId, isLoaded } = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();

    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState(SAMPLE_CODE_MAP["java"]);

    const [runningTests, setRunningTests] = useState(false);
    const [submittingMatch, setSubmittingMatch] = useState(false);

    const [testResults, setTestResults] = useState([]);
    const [problem, setProblem] = useState(null);
    const timerRef = useRef(null);

    const [room, setRoom] = useState(null);
    const [matchStatus, setMatchStatus] = useState('Connecting...'); // 'Connecting...', 'waiting', 'in_progress', 'finished'
    const [winner, setWinner] = useState(null);

    const [currentUser, setCurrentUser] = useState("");
    const [winnerName, setWinnerName] = useState("User");

    useEffect(() => {
        const fetchUserId = async () => {
            if (!isLoaded || !myUserId) return;
            console.log();
            try {
                const res = await axios.get(`http://localhost:4000/auth/by-auth/${myUserId}`);
                console.log(res);
                setCurrentUser(res.data._id);
                console.log("Fetched MongoDB user ID:", res.data._id);
            } catch (error) {
                console.error("Failed to fetch user ID:", error.response?.data || error.message);
            }
        };
        fetchUserId();
    }, [isLoaded, myUserId]);


    const fetchWinnerData = async (winner_id) => {
        if (!isLoaded || !myUserId) return;
        console.log();
        try {
            const res = await axios.get(`http://localhost:4000/auth/winner/${winner_id}`);
            console.log(res);
            setWinnerName(res.data.name)

            // console.log("Fetched MongoDB user ID:", res.data._id);
        } catch (error) {
            console.error("Failed to fetch user ID:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (!socket || !roomId || !isLoaded) {
            setMatchStatus('Connecting...');
            return;
        }

        const fetchRoomData = async () => {
            try {
                const token = await getToken();
                const res = await getRoom(roomId, token);
                const roomData = res.data.room;
                setRoom(roomData);
                setMatchStatus(roomData.status);

                if (roomData.problemId) setProblem(roomData.problemId);

                if (roomData.status === 'in_progress') {
                    const startTime = new Date(roomData.startedAt).getTime();
                    startTimer(Math.floor((Date.now() - startTime) / 1000));
                } else if (roomData.status === 'finished') {
                    setWinner(roomData.winnerId);
                    await fetchWinnerData(roomData.winnerId);
                    clearInterval(timerRef.current);
                }
            } catch (err) {
                console.error("Error fetching room data", err);
                setMatchStatus('Error');
                if (err.response?.status === 404 || err.response?.status === 401) {
                    navigate('/');
                }
            }
        };

        // ✅ Attach socket listeners BEFORE join_room emit
        const handleMatchStart = ({ room: roomData }) => {
            setRoom(roomData);
            setMatchStatus('in_progress');
            if (roomData.problemId) setProblem(roomData.problemId);
            console.log('Match started!', roomData);
            startTimer(0);
        };

        const handleMatchEnd = async({ winnerId, room: roomData }) => {
            setRoom(roomData);
            setWinner(winnerId);
            await fetchWinnerData(winnerId);
            setMatchStatus('finished');
            clearInterval(timerRef.current);
            console.log('Match finished!', roomData);
        };

        const handleLateSubmission = ({ message }) => {
            alert(message);
            setSubmittingMatch(false);
        };

        socket.on('match_start', handleMatchStart);
        socket.on('match_end', handleMatchEnd);
        socket.on('submission_accepted_late', handleLateSubmission);

        // ✅ Now emit after listeners are ready
        socket.emit('join_room', { roomId });

        fetchRoomData();

        return () => {
            socket.off('match_start', handleMatchStart);
            socket.off('match_end', handleMatchEnd);
            socket.off('submission_accepted_late', handleLateSubmission);
            clearInterval(timerRef.current);
        };
    }, [socket, roomId, getToken, navigate, isLoaded]);


    useEffect(() => {
        setCode(SAMPLE_CODE_MAP[language]);
    }, [language]);

    const startTimer = (initialTime) => {
        clearInterval(timerRef.current);
        setSecondsElapsed(initialTime);
        timerRef.current = setInterval(() => {
            setSecondsElapsed((s) => s + 1);
        }, 1000);
    };

    const formatTime = (secs) => {
        const mm = Math.floor(secs / 60)
            .toString()
            .padStart(2, "0");
        const ss = (secs % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    const handleRunTests = async () => {
        if (!problem || !problem.examples || problem.examples.length === 0) return;
        setRunningTests(true);
        setTestResults([]);
        const results = [];

        for (let i = 0; i < problem.examples.length; i++) {
            const tc = problem.examples[i];
            try {
                const res = await runCodeOnJudge0({
                    source_code: code,
                    language_id: LANGUAGE_ID_MAP[language],
                    stdin: tc.input || "",
                });

                let passed = false;
                if (res.stdout) {
                    const out = res.stdout.replace(/\s+/g, "").trim();
                    const exp = (tc.output || "").replace(/\s+/g, "").trim();
                    passed = out === exp;
                }
                results.push({
                    input: tc.input,
                    expected: tc.output,
                    output: res.stdout || "",
                    error: res.stderr || res.error || "",
                    passed,
                    status: res.status?.description || ""
                });
            } catch (err) {
                results.push({
                    input: tc.input,
                    expected: tc.output,
                    output: "",
                    error: err.message,
                    passed: false,
                    status: "Error"
                });
            }
        }
        setTestResults(results);
        setRunningTests(false);
    };

    const handleFinalSubmit = async () => {
        if (matchStatus !== 'in_progress' || !room || !problem) return;

        setSubmittingMatch(true);
        try {
            const token = await getToken();
            const res = await submitFinalSolution({
                code,
                language: language,
                problemId: problem._id, // Send the problem's ID
                roomId,
                token,
            });
            console.log('Submission received by server:', res.data);


        } catch (err) {
            console.error("Submission failed", err);
            alert("Submission failed: " + err.response?.data?.message);
            setSubmittingMatch(false);
        }
    };

    if (matchStatus === 'Connecting...' || matchStatus === 'waiting') {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 text-center font-inter">
                <div className="bg-[#061e22]/95 p-8 rounded-2xl shadow-2xl w-80 sm:w-[26rem] animate-fadeIn">
                    <h2 className="text-xl font-semibold text-cyan-100 mb-5">
                        {matchStatus === 'Connecting...' ? 'Connecting to match...' : 'Waiting for opponent...'}
                    </h2>
                    <div className="flex justify-center gap-3 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-5 h-5 rounded-full bg-cyan-400 animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                    {matchStatus === 'waiting' && room?.shareCode && (
                        <div className="mt-4">
                            <p className="text-sm text-slate-400">Share this code with your opponent:</p>
                            <p className="text-2xl font-mono font-bold text-white bg-cyan-900/50 rounded-lg py-2 mt-2 tracking-widest">
                                {room.shareCode}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (matchStatus === 'finished') {
        // Use the real user ID from Clerk
        const isWinner = String(winner) === String(currentUser);
        console.log("Winnnnerrr", winner);
        console.log("currentUser", currentUser);
        console.log("www", winnerName);




        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 text-center font-inter animate-fadeIn">
                <div className={`bg-[#061e22]/95 p-8 rounded-2xl shadow-2xl w-80 sm:w-[26rem] border-t-4 ${isWinner ? 'border-green-500' : 'border-red-500'}`}>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isWinner ? "Victory!" : "Match Over"}
                    </h2>
                    {isWinner ? (
                        <AiOutlineCheckCircle className="text-green-500 text-7xl mx-auto mb-4" />
                    ) : (
                        <AiOutlineCloseCircle className="text-red-500 text-7xl mx-auto mb-4" />
                    )}
                    <p className="text-lg text-slate-200 mb-2">
                        {isWinner ? "You won the match!" : "Your opponent finished first."}
                    </p>
                    <p className="text-sm text-slate-400 mb-6">
                        Winner: {winnerName}
                    </p>
                    <button
                        className="bg-slate-100 text-[#071820] font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (matchStatus === 'Error') {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 text-center font-inter">
                <div className="bg-[#061e22]/95 p-8 rounded-2xl shadow-2xl w-80 sm:w-[26rem] animate-fadeIn border-t-4 border-red-500">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Error
                    </h2>
                    <AiOutlineCloseCircle className="text-red-500 text-7xl mx-auto mb-4" />
                    <p className="text-lg text-slate-200 mb-6">
                        Could not load the match. The room may not exist or your session may be invalid.
                    </p>
                    <button
                        className="bg-slate-100 text-[#071820] font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#071820] text-slate-200 font-inter relative overflow-hidden">
            <div className="flex justify-center py-4">
                <div className="bg-[#0d2229]/60 backdrop-blur-sm rounded-xl px-6 py-2 flex items-center gap-3 shadow-lg">
                    <span className="text-xs tracking-widest text-slate-400 uppercase">
                        Timer
                    </span>
                    <span className="font-mono text-lg font-bold text-cyan-100">
                        {formatTime(secondsElapsed)}
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 px-6 pb-24">
                <div className="flex-1 bg-transparent rounded-2xl p-6">
                    {problem ? (
                        <>
                            <h1 className="text-3xl font-mono text-cyan-100 mb-3">
                                {problem.title}
                            </h1>
                            <p className="text-slate-300 max-w-xl whitespace-pre-wrap">
                                {problem.statement?.description}
                            </p>
                            <div className="mt-6 bg-cyan-950 rounded-xl p-4 shadow-inner">
                                <h2 className="text-cyan-300 font-semibold mb-2">Input Format:</h2>
                                <pre className="bg-[#021518]/60 rounded-lg p-3 text-sm text-cyan-100 whitespace-pre-wrap">
                                    {problem.statement?.input_format}
                                </pre>
                                <h2 className="text-cyan-300 font-semibold mt-4 mb-2">Output Format:</h2>
                                <pre className="bg-[#021518]/60 rounded-lg p-3 text-sm text-cyan-100 whitespace-pre-wrap">
                                    {problem.statement?.output_format}
                                </pre>
                            </div>
                            <div className="mt-6 bg-cyan-950 rounded-lg p-4">
                                <strong className="text-cyan-200">Examples:</strong>
                                <ul className="list-disc list-inside text-slate-300 text-sm mt-2">
                                    {problem.examples?.map((ex, idx) => (
                                        <li key={idx} className="mb-2 bg-[#021518]/60 p-2 rounded">
                                            <div><span className="font-bold">Input:</span> <pre className="inline whitespace-pre-wrap">{ex.input}</pre></div>
                                            <div><span className="font-bold">Output:</span> <pre className="inline whitespace-pre-wrap">{ex.output}</pre></div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <span className="text-slate-400">Loading problem…</span>
                    )}
                </div>

                <div className="flex-[1.1] flex flex-col gap-4">
                    <div className="flex justify-start">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-[#0d2229]/80 text-cyan-100 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                        >
                            {LANGUAGE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden shadow-lg">
                        <Editor
                            key={language}
                            height="100%"
                            language={language}
                            value={code}
                            onChange={setCode}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                automaticLayout: true,
                                fontSize: 13,
                                wordWrap: "on",
                            }}
                        />
                    </div>

                    <div className="h-56 bg-[#021518]/60 rounded-xl p-4 flex flex-col overflow-auto">
                        <span className="text-cyan-400 font-semibold">Test Cases</span>
                        {runningTests ? (
                            <div className="flex items-center justify-center h-full">
                                <AiOutlineLoading3Quarters className="text-cyan-400 text-4xl animate-spin" />
                            </div>
                        ) : testResults.length > 0 ? (
                            <div className="mt-2 text-sm space-y-2">
                                {testResults.map((tr, idx) => (
                                    <div key={idx} className={`p-2 rounded-lg ${tr.passed ? "bg-green-900/40" : "bg-red-900/30"}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-white">Test Case {idx + 1}</span>
                                            <span className={`font-bold text-xs px-2 py-0.5 rounded ${tr.passed ? "bg-green-300 text-green-900" : "bg-red-300 text-red-900"}`}>{tr.passed ? "Passed" : "Failed"}</span>
                                        </div>

                                        {!tr.passed && (
                                            <div className="mt-1 space-y-1 text-xs">
                                                <div className="font-mono text-cyan-300"><span className="font-bold">Input:</span> <pre className="inline whitespace-pre-wrap">{tr.input}</pre></div>
                                                <div className="font-mono text-cyan-200"><span className="font-bold">Expected:</span> <pre className="inline whitespace-pre-wrap">{tr.expected}</pre></div>
                                                <div className="font-mono text-cyan-100"><span className="font-bold">Got:</span> <pre className="inline whitespace-pre-wrap">{tr.output || `"${tr.error}"`}</pre></div>
                                                {tr.status && <div className="text-slate-400">Status: {tr.status}</div>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-sm mt-3 opacity-70">Click "Run Tests" to check against examples.</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 flex gap-4">
                <button
                    className="bg-gray-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-500 active:scale-95 transition disabled:opacity-50"
                    onClick={handleRunTests}
                    disabled={runningTests || submittingMatch || matchStatus !== 'in_progress'}
                >
                    {runningTests ? (<AiOutlineLoading3Quarters className="animate-spin" />) : "Run Tests"}
                </button>
                <button
                    className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-green-500 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleFinalSubmit}
                    disabled={runningTests || submittingMatch || matchStatus !== 'in_progress'}
                >
                    {submittingMatch ? (<AiOutlineLoading3Quarters className="animate-spin" />) : "Submit Match"}
                </button>
            </div>
        </div>
    );
}

