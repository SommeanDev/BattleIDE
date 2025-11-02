import { Award, Trophy } from "lucide-react";
import GlassCard from "./GlassCard";

const LeaderboardC = ({ users, currentUser }) => (
    <GlassCard className="p-6  w-5xl ">
        {/* <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3" />
            Global Leaderboard
        </h3> */}
        {/* Increased max-height as this component is taller now */}
        <div className="max-h-[600px] overflow-y-auto pr-2">
            <ul className="space-y-2">
                {users.map((user, index) => {
                    const isCurrentUser = currentUser && user.username === currentUser.username;
                    const rank = index + 1;

                    let rankIcon;
                    if (rank === 1) rankIcon = <Trophy className="text-yellow-400 w-5 h-5" />;
                    else if (rank === 2) rankIcon = <Trophy className="text-slate-300 w-5 h-5" />;
                    else if (rank === 3) rankIcon = <Trophy className="text-yellow-600 w-5 h-5" />;
                    else rankIcon = <span className="text-slate-400 w-5 text-center">{rank}</span>;

                    return (
                        <li
                            key={user.username}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all
                ${isCurrentUser
                                    ? 'bg-cyan-600/30 border-2 border-cyan-500'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-8 text-center">{rankIcon}</div>
                                <span className={`font-medium ${isCurrentUser ? 'text-white' : 'text-slate-200'}`}>
                                    {user.username}
                                </span>
                            </div>
                            <span className={`font-bold text-lg ${isCurrentUser ? 'text-white' : 'text-cyan-400'}`}>
                                {user.rating}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    </GlassCard>
);
export default LeaderboardC