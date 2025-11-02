import { CheckCircle, Swords, Target, Trophy, XCircle } from "lucide-react";

const UserProfileCard = ({ user }) => {
    const submissions = Array.isArray(user.submissions) ? user.submissions : [];
    const matches = Array.isArray(user.matches) ? user.matches : [];

    const totalMatches = matches.length;
    const wonRoomIds = new Set(
        submissions
            .filter(s => s.status === "Accepted")
            .map(s => s.roomId?.toString())
    );
    const matchesWon = wonRoomIds.size;
    const matchesLost = Math.max(0, totalMatches - matchesWon);
    const battleAccuracy =
        totalMatches > 0 ? ((matchesWon / totalMatches) * 100).toFixed(1) : "0.0";

    return (
        <div className="relative w-full max-w-md p-8 rounded-2xl bg-[#0b0b0d]/90 backdrop-blur-xl border border-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,255,255,0.05),0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[inset_0_0_25px_rgba(0,255,255,0.08),0_0_40px_rgba(0,255,255,0.2)]">

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/5 blur-2xl -z-10"></div>

            {/* Avatar */}
            <div className="flex flex-col items-center">
                <img
                    src={
                        user.avatarUrl ||
                        `https://placehold.co/128x128/000000/06b6d4?text=${user.username
                            .substring(0, 2)
                            .toUpperCase()}`
                    }
                    alt={user.username}
                    className="w-28 h-28 rounded-full border-2 border-cyan-500/40 object-cover shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/128x128/000000/FFFFFF?text=USER";
                    }}
                />

                {/* Username */}
                <h2 className="mt-5 text-3xl font-bold tracking-wide text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    {user.username}
                </h2>
            </div>

            {/* Stats */}
            <div className="mt-8 text-xl space-y-4 text-base text-slate-300">
                <StatRow
                    icon={<Trophy className="w-5 h-5 mr-3 text-yellow-400" />}
                    label="Current Rating"
                    value={user.rating}
                    valueClass="text-yellow-400"
                />

                <StatRow
                    icon={<Target className="w-5 h-5 mr-3 text-cyan-400" />}
                    label="Win Rate"
                    value={`${battleAccuracy}%`}
                    valueClass="text-cyan-400"
                />

                <StatRow
                    icon={<Swords className="w-5 h-5 mr-3 text-blue-400" />}
                    label="Matches Played"
                    value={totalMatches}
                    valueClass="text-blue-400"
                />

                <StatRow
                    icon={<CheckCircle className="w-5 h-5 mr-3 text-green-400" />}
                    label="Matches Won"
                    value={matchesWon}
                    valueClass="text-green-400"
                />

                <StatRow
                    icon={<XCircle className="w-5 h-5 mr-3 text-red-400" />}
                    label="Matches Lost"
                    value={matchesLost}
                    valueClass="text-red-400"
                />
            </div>
        </div>
    );
};

// Subcomponent for each row
const StatRow = ({ icon, label, value, valueClass }) => (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#101014]/80 border border-white/5 shadow-inner hover:bg-[#16161a]/80 transition-all duration-200">
        <span className="flex items-center font-medium text-slate-300">
            {icon}
            {label}
        </span>
        <span className={`font-semibold text-2xl ${valueClass}`}>{value}</span>
    </div>
);

export default UserProfileCard;
