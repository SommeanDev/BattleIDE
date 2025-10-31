import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { submitCode } from "../services/judge0";
import SAMPLE_CODE_MAP from "../constants/sampleCodeMap";
// Define language options for the dropdown
const LANGUAGE_OPTIONS = [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
];

import { fetchMatchProblem } from "../services/match";

export default function Battle() {
    const [loading, setLoading] = useState(true);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState(SAMPLE_CODE_MAP["java"]);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [problem, setProblem] = useState(null);
    const timerRef = useRef(null);


    // Map language to Judge0 language_id
    const LANGUAGE_ID_MAP = {
        java: 62,
        python: 71,
        javascript: 63,
    };

    useEffect(() => {
        // Fetch problem from backend using service
        fetchMatchProblem()
            .then(data => {
                setProblem(data);
                setLoading(false);
                timerRef.current = setInterval(() => {
                    setSecondsElapsed((s) => s + 1);
                }, 1000);
            })
            .catch(() => {
                setLoading(false);
            });
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        setCode(SAMPLE_CODE_MAP[language]);
    }, [language]);

    const formatTime = (secs) => {
        const mm = Math.floor(secs / 60)
            .toString()
            .padStart(2, "0");
        const ss = (secs % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    // Run code against all test cases from the fetched problem
    const handleSubmit = async () => {
        if (!problem || !problem.examples || problem.examples.length === 0) return;
        setSubmitting(true);
        setTestResults([]);
        const results = [];
        for (let i = 0; i < problem.examples.length; i++) {
            const tc = problem.examples[i];
            let codeToRun = code;
            let stdin = tc.input || "";
            // For most problems, user code should read from stdin
            try {
                const res = await submitCode({
                    source_code: codeToRun,
                    language_id: LANGUAGE_ID_MAP[language],
                    stdin,
                });
                // Compare output (stdout) to expected
                let passed = false;
                if (res.stdout) {
                    // Remove whitespace and newlines for comparison
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
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#071820] text-slate-200 font-inter relative overflow-hidden">
            {/* TIMER */}
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

            {/* MAIN CONTENT */}
            <div className="flex flex-col lg:flex-row gap-6 px-6 pb-24">
                {/* LEFT PANEL */}
                <div className="flex-1 bg-transparent rounded-2xl p-6">
                    {problem ? (
                        <>
                            <h1 className="text-3xl font-mono text-cyan-100 mb-3">
                                {problem.title}
                            </h1>
                            <p className="text-slate-300 max-w-xl">
                                {problem.statement?.description}
                            </p>
                            {/* Input/Output Format */}
                            <div className="mt-6 bg-cyan-950 rounded-xl p-4 shadow-inner">
                                <h2 className="text-cyan-300 font-semibold mb-2">Input Format:</h2>
                                <pre className="bg-[#021518]/60 rounded-lg p-3 text-sm text-cyan-100">
                                    {problem.statement?.input_format}
                                </pre>
                                <h2 className="text-cyan-300 font-semibold mt-4 mb-2">Output Format:</h2>
                                <pre className="bg-[#021518]/60 rounded-lg p-3 text-sm text-cyan-100">
                                    {problem.statement?.output_format}
                                </pre>
                            </div>
                            {/* Examples */}
                            <div className="mt-6 bg-cyan-950 rounded-lg p-4">
                                <strong className="text-cyan-200">Examples:</strong>
                                <ul className="list-disc list-inside text-slate-300 text-sm mt-2">
                                    {problem.examples?.map((ex, idx) => (
                                        <li key={idx} className="mb-2">
                                            <div><span className="font-bold">Input:</span> {ex.input}</div>
                                            <div><span className="font-bold">Output:</span> {ex.output}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <span className="text-slate-400">Loading problem…</span>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-[1.1] flex flex-col gap-4">
                    {/* LANGUAGE SELECTOR DROPDOWN */}
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

                    {/* ...removed custom input field... */}

                    {/* Test Results for all test cases */}
                    <div className="h-56 bg-[#021518]/60 rounded-xl p-4 flex flex-col overflow-auto">
                        <span className="text-cyan-400 font-semibold">Test Cases</span>
                        {submitting ? (
                            <span className="text-slate-400 text-sm mt-3 opacity-70">Running code…</span>
                        ) : testResults.length > 0 ? (
                            <div className="mt-2 text-sm">
                                {testResults.map((tr, idx) => (
                                    <div key={idx} className={`mb-3 p-2 rounded-lg ${tr.passed ? "bg-green-900/40" : "bg-red-900/30"}`}>
                                        <div className="font-mono text-xs text-cyan-300">Input: {tr.input}</div>
                                        <div className="font-mono text-xs text-cyan-200">Expected: {tr.expected}</div>
                                        <div className="font-mono text-xs text-cyan-100">Output: {tr.output}</div>
                                        {tr.error && <div className="text-yellow-300">Error: <span className="text-yellow-100">{tr.error}</span></div>}
                                        <div className="text-xs text-slate-400">Status: {tr.status}</div>
                                        <div className={`font-bold mt-1 ${tr.passed ? "text-green-400" : "text-red-400"}`}>{tr.passed ? "Passed" : "Failed"}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-sm mt-3 opacity-70">You must run your code first</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-6 right-6">
                <button
                    className="bg-slate-100 text-[#071820] font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Submitting…" : "Submit"}
                </button>
            </div>

            {/* LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 text-center">
                    <div className="bg-[#061e22]/95 p-8 rounded-2xl shadow-2xl w-80 sm:w-[26rem] animate-fadeIn">
                        <h2 className="text-xl font-semibold text-cyan-100 mb-5">
                            Searching players online
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
                        <p className="text-sm text-slate-400 mt-2">Preparing match…</p>
                    </div>
                </div>
            )}
        </div>
    );
}