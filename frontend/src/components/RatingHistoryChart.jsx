import GlassCard from "./GlassCard";
import React from "react";
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
const RatingHistoryChart = ({ submissions, userCreatedAt }) => {
    // Process submissions to create rating history
    const chartData = React.useMemo(() => {
        if (!Array.isArray(submissions) || !userCreatedAt) {
            return [];
        }

        // 1. Sort all submissions by date
        const sortedSubmissions = [...submissions].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

        let currentRating = 1200;
        // 2. Add starting point
        const history = [
            {
                time: new Date(userCreatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                rating: 1200
            }
        ];

        // 3. Process each submission
        sortedSubmissions.forEach(sub => {
            if (sub.status === 'Accepted') {
                currentRating += 100;
            }
            // Add a point for every submission to show progress over time
            history.push({
                time: new Date(sub.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                rating: currentRating
            });
        });

        // De-duplicate dates if multiple submissions on the same day, keeping only the last one
        const uniqueDayHistory = Object.values(
            history.reduce((acc, entry) => {
                acc[entry.time] = entry; // Keep overwriting, so only the last entry for that day is kept
                return acc;
            }, {})
        );

        return uniqueDayHistory;

    }, [submissions, userCreatedAt]);

    if (chartData.length <= 1) {
        return (
            <GlassCard className="p-6">
                <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-4">
                    Rating History
                </h3>
                <div className="h-64 flex items-center justify-center text-slate-400">
                    Not enough data for rating chart. Complete some matches!
                </div>
            </GlassCard>
        )
    }

    return (
        <GlassCard className="p-6">
            <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-6">
                Rating History
            </h3>
            {/* Chart */}
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -20, // Adjust to show Y-axis labels
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                            domain={['dataMin - 100', 'dataMax + 100']} // Add padding
                            allowDataOverflow={true}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                borderColor: '#06b6d4',
                                borderRadius: '10px'
                            }}
                            labelStyle={{ color: '#ffffff' }}
                            itemStyle={{ color: '#06b6d4' }}
                        />
                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                        <Line
                            type="monotone"
                            dataKey="rating"
                            stroke="#06b6d4" // Cyan color
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                            dot={{ stroke: '#06b6d4', strokeWidth: 1, r: 4, fill: '#06b6d4' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default RatingHistoryChart