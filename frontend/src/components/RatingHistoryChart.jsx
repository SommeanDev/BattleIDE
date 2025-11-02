import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const RatingHistoryChart = ({ submissions, userCreatedAt }) => {
    const chartData = React.useMemo(() => {
        if (!Array.isArray(submissions) || !userCreatedAt) {
            return [];
        }

        const sortedSubmissions = [...submissions].sort(
            (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        );

        let currentRating = 1200;
        const history = [
            {
                time: new Date(userCreatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                Rating: 1200,
            },
        ];

        sortedSubmissions.forEach((sub) => {
            if (sub.status === "Accepted") currentRating += 100;
            history.push({
                time: new Date(sub.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                Rating: currentRating,
            });
        });

        // Unique per day
        const uniqueDayHistory = Object.values(
            history.reduce((acc, entry) => {
                acc[entry.time] = entry;
                return acc;
            }, {})
        );

        return uniqueDayHistory;
    }, [submissions, userCreatedAt]);

    if (chartData.length <= 1) {
        return (
            <div className="relative w-full max-w-2xl p-8 rounded-2xl bg-[#0b0b0d]/90 backdrop-blur-xl border border-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)]">
                <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-4 text-center">
                    Rating History
                </h3>
                <div className="h-64 flex items-center justify-center text-slate-500">
                    Not enough data for rating chart. Complete some matches!
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-full p-8 rounded-2xl bg-[#0b0b0d]/90 backdrop-blur-xl border border-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[inset_0_0_25px_rgba(0,255,255,0.08),0_0_40px_rgba(0,255,255,0.2)]">

            {/* Glow Layer */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/5 blur-2xl -z-10"></div>

            <h3 className="text-2xl font-bold tracking-widest text-white mb-8 text-center drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                Rating History
            </h3>

            <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: -20, bottom: 10 }}
                    >
                        {/* Gradient Fill */}
                        <defs>
                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#facc15" stopOpacity={0.7} />
                                <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* Chart Grid */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

                        {/* Axis Styling */}
                        <XAxis
                            dataKey="time"
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fontSize: 14 }}
                            domain={["dataMin - 100", "dataMax + 100"]}
                            allowDataOverflow={true}
                        />

                        {/* Tooltip */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                borderColor: "#facc15",
                                borderRadius: "10px",
                                boxShadow: "0 0 15px rgba(250, 204, 21, 0.3)",
                            }}
                            labelStyle={{ color: "#ffffff" }}
                            itemStyle={{ color: "#facc15" }}
                        />

                        {/* Line */}
                        <Line
                            type="monotone"
                            dataKey="Rating"
                            stroke="#facc15"
                            strokeWidth={3}
                            fill="url(#goldGradient)"
                            fillOpacity={1}
                            activeDot={{ r: 8, fill: "#facc15", stroke: "#fff", strokeWidth: 2 }}
                            dot={{ r: 4, stroke: "#facc15", fill: "#facc15" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RatingHistoryChart;
