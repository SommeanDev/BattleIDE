import { Award, Trophy } from "lucide-react";
import GlassCard from "./GlassCard";

const LeaderboardC = ({ users, currentUser }) => (
    <div className="relative w-full max-w-6xl mt-24 md-4 p-8 rounded-2xl bg-[#0b0b0d]/90 backdrop-blur-xl border border-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[inset_0_0_25px_rgba(0,255,255,0.08),0_0_40px_rgba(0,255,255,0.2)]">
        <h3 className="text-3xl font-semibold tracking-widest text-white mb-8 flex items-center justify-center">
            <Award className="w-7 h-7 text-cyan-400 mr-3" />
            Global Leaderboard
        </h3>

        <div className="max-h-[650px] overflow-y-auto pr-2  custom-scrollbar">
            <ul className="space-y-3">
                {users.map((user, index) => {
                    const isCurrentUser = currentUser && user.username === currentUser.username;
                    const rank = index + 1;

                    let rankIcon;
                    if (rank === 1)
                        rankIcon = <Trophy className="text-yellow-400 w-7 h-7 drop-shadow-glow" />;
                    else if (rank === 2)
                        rankIcon = <Trophy className="text-gray-300 w-7 h-7" />;
                    else if (rank === 3)
                        rankIcon = <Trophy className="text-amber-700 w-7 h-7" />;
                    else
                        rankIcon = (
                            <span className="text-slate-400 font-semibold text-lg w-7 text-center">
                                {rank}
                            </span>
                        );

                    return (
                        <li
                            key={user.username}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 
                            shadow-md backdrop-blur-sm border border-white/10
                            ${isCurrentUser
                                    ? 'bg-cyan-600/20 border-cyan-400/50 shadow-cyan-500/30'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center space-x-6 ">
                                <div className="w-7 text-center">{rankIcon}</div>
                                <span
                                    className={`font-medium text-lg tracking-wide ${isCurrentUser ? 'text-white' : 'text-slate-200'
                                        }`}
                                >
                                    {user.username}
                                </span>
                            </div>

                            <span
                                className={`font-bold text-lg ${isCurrentUser ? 'text-white' : 'text-cyan-400'
                                    }`}
                            >
                                {user.rating}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>
);

export default LeaderboardC;
