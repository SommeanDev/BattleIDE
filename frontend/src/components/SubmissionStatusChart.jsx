import GlassCard from "./GlassCard";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
const SubmissionStatusChart = ({ submissions }) => {
    if (!Array.isArray(submissions) || submissions.length === 0) {
        return (
            <GlassCard className="p-6">
                <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-4">
                    Submission Overview
                </h3>
                <div className="h-64 flex items-center justify-center text-slate-400">
                    No submissions yet. Try solving some problems!
                </div>
            </GlassCard>
        );
    }

    // Count each status
    const counts = submissions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
    }, {});

    // Prepare chart data
    const chartData = Object.keys(counts).map(status => ({
        name: status,
        value: counts[status],
    }));

    const COLORS = {
        'Accepted': '#06b6d4',           // cyan
        'Runtime Error': '#22c55e',    // green
        'Wrong Answer': '#ef4444',     // red
        'Time Limit Exceeded': '#eab308', // yellow
        'Compilation Error': '#a855f7' // purple
    };


    return (
        <GlassCard className="p-6">
            <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-6">
                Submission Overview
            </h3>
            <div className="flex flex-col lg:flex-row items-center justify-around gap-6">
                {/* Pie Chart */}
                <div style={{ width: 530, height: 280 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={4}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.name] || '#cccccc'} // fallback color if not found
                                    />
                                ))}
                            </Pie>
                        </PieChart>

                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                    {chartData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center space-x-3 text-slate-300">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-sm font-medium">{entry.name}</span>
                            <span className="font-bold text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};

export default SubmissionStatusChart