import GlassCard from "./GlassCard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const SubmissionStatusChart = ({ submissions }) => {
    if (!Array.isArray(submissions) || submissions.length === 0) {
        return (
            <div className="relative w-full max-w-2xl p-8 rounded-2xl bg-[#0b0b0d]/90 backdrop-blur-xl border border-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)]">
                <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-4 text-center">
                    Submission Overview
                </h3>
                <div className="h-64 flex items-center justify-center text-slate-500">
                    No submissions yet. Try solving some problems!
                </div>
            </div>
        );
    }

    // Count each status
    const counts = submissions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
    }, {});

    // Prepare chart data
    const chartData = Object.keys(counts).map((status) => ({
        name: status,
        value: counts[status],
    }));

    const COLORS = {
        Accepted: "#22d3ee",              // bright cyan
        "Runtime Error": "#fffb00ff",       // blue
        "Wrong Answer": "#ef4444",        // red
        "Time Limit Exceeded": "#eab308", // yellow
        "Compilation Error": "#a855f7",   // purple
    };

    return (
        <div className="relative w-full max-w-full p-8 rounded-2xl bg-[#0b0b0d]/90 backdrop-blur-xl border border-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[inset_0_0_25px_rgba(0,255,255,0.08),0_0_40px_rgba(0,255,255,0.2)]">

            {/* Glow layer */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/5 blur-2xl -z-10"></div>

            <h3 className="text-2xl font-bold tracking-widest text-white mb-8 text-center drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                Submission Overview
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
                {/* Pie Chart */}
                <div style={{ width: 480, height: 280 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={4}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                labelStyle={{
                                    fill: "#ffffff",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                }}
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.name] || "#94a3b8"}
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-3 bg-[#101014]/80 px-5 py-4 rounded-xl border border-white/5 shadow-inner">
                    {chartData.map((entry, index) => (
                        <div
                            key={entry.name}
                            className="flex items-center justify-between gap-6 text-slate-300 hover:text-white transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                    style={{
                                        backgroundColor: COLORS[entry.name],
                                    }}
                                ></div>
                                <span className="text-sm font-medium">
                                    {entry.name}
                                </span>
                            </div>
                            <span className="font-bold text-white">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubmissionStatusChart;
