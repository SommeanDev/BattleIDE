import { CheckCircle, Swords, Target, Trophy, XCircle } from "lucide-react";
import GlassCard from "./GlassCard";

const UserProfileCard = ({ user }) => {

    const submissions = Array.isArray(user.submissions) ? user.submissions : [];
    const matches = Array.isArray(user.matches) ? user.matches : [];

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted').length;

    const totalMatches = matches.length;
    
    const wonRoomIds = new Set(
        submissions
            .filter(s => s.status === 'Accepted')
            .map(s => s.roomId.toString())
    );

    const matchesWon = wonRoomIds.size;
    const matchesLost = Math.max(0, totalMatches - matchesWon); // Ensure it's not negative
    const battleAccuracy = totalMatches > 0
        ? ((matchesWon / totalMatches) * 100).toFixed(1)
        : "0.0";

    return (
        <GlassCard className="p-6 flex flex-col items-center">
            <img
                src={user.avatarUrl || `https://placehold.co/128x128/000000/06b6d4?text=${user.username.substring(0, 2).toUpperCase()}`}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-cyan-500/50 shadow-lg"
                onError={(e) => { e.target.src = 'https://placehold.co/128x128/000000/FFFFFF?text=USER'; }}
            />
            <h2 className="mt-4 text-3xl font-bold tracking-widest text-white">
                {user.username}
            </h2>

            <div className="mt-6 w-full space-y-3">
                {/* Rating */}
                <div className="flex items-center justify-between text-lg">
                    <span className="flex items-center text-slate-300">
                        <Trophy className="w-5 h-5 mr-3 text-cyan-400" />
                        Current Rating
                    </span>
                    <span className="font-bold text-cyan-400 text-xl">
                        {user.rating}
                    </span>
                </div>

                {/* Accuracy */}
                <div className="flex items-center justify-between text-lg">
                    <span className="flex items-center text-slate-300">
                        <Target className="w-5 h-5 mr-3 text-cyan-400" />
                         Win Rate
                    </span>
                    <span className="font-bold text-white">
                        {battleAccuracy}%
                    </span>
                </div>

                {/* Matches Played */}
                <div className="flex items-center justify-between text-lg">
                    <span className="flex items-center text-slate-300">
                        <Swords className="w-5 h-5 mr-3 text-cyan-400" />
                        Matches Played
                    </span>
                    <span className="font-bold text-white">
                        {totalMatches}
                    </span>
                </div>

                {/* Matches Won */}
                <div className="flex items-center justify-between text-lg">
                    <span className="flex items-center text-slate-300">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                        Matches Won
                    </span>
                    <span className="font-bold text-green-400">
                        {matchesWon}
                    </span>
                </div>

                {/* Matches Lost */}
                <div className="flex items-center justify-between text-lg">
                    <span className="flex items-center text-slate-300">
                        <XCircle className="w-5 h-5 mr-3 text-red-400" />
                        Matches Lost
                    </span>
                    <span className="font-bold text-red-400">
                        {matchesLost}
                    </span>
                </div>

            </div>

        </GlassCard>

        
    );
};

export default UserProfileCard