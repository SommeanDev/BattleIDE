import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { submitCode } from "../services/judge0";


// Store sample code for each language in an object
const SAMPLE_CODE_MAP = {
    java: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> ans = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return ans;
        int top = 0, left = 0;
        int bottom = matrix.length - 1, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) ans.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) ans.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) ans.add(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) ans.add(matrix[i][left]);
                left++;
            }
        }
        return ans;
    }
}`,
    python: `class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        if not matrix:
            return []
        
        rows, cols = len(matrix), len(matrix[0])
        top, bottom, left, right = 0, rows - 1, 0, cols - 1
        ans = []
        
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                ans.append(matrix[top][j])
            top += 1
            
            for i in range(top, bottom + 1):
                ans.append(matrix[i][right])
            right -= 1
            
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    ans.append(matrix[bottom][j])
                bottom -= 1
            
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    ans.append(matrix[i][left])
                left += 1
                
        return ans
`,
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    if (!matrix || matrix.length === 0) {
        return [];
    }
    
    const ans = [];
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) {
            ans.push(matrix[top][j]);
        }
        top++;
        
        for (let i = top; i <= bottom; i++) {
            ans.push(matrix[i][right]);
        }
        right--;
        
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                ans.push(matrix[bottom][j]);
            }
            bottom--;
        }
        
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                ans.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return ans;
};`,
};

// Define language options for the dropdown
const LANGUAGE_OPTIONS = [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
];



export default function Battle() {
    const [loading, setLoading] = useState(true);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState(SAMPLE_CODE_MAP["java"]);
    const [stdin, setStdin] = useState("");
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const timerRef = useRef(null);

    // Map language to Judge0 language_id
    const LANGUAGE_ID_MAP = {
        java: 62,
        python: 71,
        javascript: 63,
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
            timerRef.current = setInterval(() => {
                setSecondsElapsed((s) => s + 1);
            }, 1000);
        }, 5000);
        return () => {
            clearTimeout(timeout);
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

    const handleSubmit = async () => {
        setSubmitting(true);
        setResult(null);
        try {
            const res = await submitCode({
                source_code: code,
                language_id: LANGUAGE_ID_MAP[language],
                stdin,
            });
            setResult(res);
        } catch (err) {
            setResult({ error: "Submission failed", details: err.message });
        } finally {
            setSubmitting(false);
        }
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
                    <h1 className="text-3xl font-mono text-cyan-100 mb-3">
                        Spiral Matrix
                    </h1>
                    <p className="text-slate-300 max-w-xl">
                        Given an m × n integer matrix, return all elements of the matrix in
                        spiral order.
                    </p>

                    {/* Example */}
                    <div className="mt-6 bg-cyan-950 rounded-xl p-4 shadow-inner">
                        <h2 className="text-cyan-300 font-semibold mb-2">Example 1:</h2>
                        <pre className="bg-[#021518]/60 rounded-lg p-3 text-sm text-cyan-100">
                            {`matrix = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]`}
                        </pre>
                        <div className="mt-3 text-slate-200">
                            Output: [1,2,3,6,9,8,7,4,5]
                        </div>
                    </div>

                    {/* Constraints */}
                    <div className="mt-6 bg-cyan-950 rounded-lg p-4">
                        <strong className="text-cyan-200">Constraints:</strong>
                        <ul className="list-disc list-inside text-slate-300 text-sm mt-2">
                            <li>m == matrix.length</li>
                            <li>n == matrix[i].length</li>
                            <li>1 &lt;= m, n &lt;= 10</li>
                            <li>-100 &lt;= matrix[i][j] &lt;= 100</li>
                        </ul>
                    </div>
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

                    {/* STDIN input */}
                    <div className="mb-2">
                        <label className="text-cyan-400 font-semibold block mb-1">Custom Input (stdin):</label>
                        <textarea
                            value={stdin}
                            onChange={e => setStdin(e.target.value)}
                            className="w-full bg-[#021518]/60 rounded-lg p-2 text-cyan-100 text-sm focus:outline-none"
                            rows={3}
                            placeholder="Enter custom input for your code (optional)"
                        />
                    </div>

                    {/* Test Result */}
                    <div className="h-40 bg-[#021518]/60 rounded-xl p-4 flex flex-col overflow-auto">
                        <span className="text-cyan-400 font-semibold">Result</span>
                        {submitting ? (
                            <span className="text-slate-400 text-sm mt-3 opacity-70">Running code…</span>
                        ) : result ? (
                            <div className="mt-2 text-sm">
                                {result.error ? (
                                    <div className="text-red-400 font-bold">Error: {result.error}<br/>{result.details && <span className="text-xs">{result.details}</span>}</div>
                                ) : (
                                    <>
                                        {result.stdout && <div><span className="text-cyan-300">Output:</span> <pre className="bg-[#061e22] rounded p-2 text-cyan-100 whitespace-pre-wrap">{result.stdout}</pre></div>}
                                        {result.stderr && <div><span className="text-yellow-300">Error:</span> <pre className="bg-[#061e22] rounded p-2 text-yellow-100 whitespace-pre-wrap">{result.stderr}</pre></div>}
                                        {result.status && <div className="text-slate-400">Status: {result.status.description}</div>}
                                    </>
                                )}
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