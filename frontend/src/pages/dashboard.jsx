import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react"; 
import {
    Trophy,
    Swords,
    Award,
    CheckCircle,
    XCircle,
    Target
} from 'lucide-react';


const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl ${className}`}>
        {children}
    </div>
);

// --- DASHBOARD COMPONENTS ---

// 1. User Profile Card
const UserProfileCard = ({ user }) => {
    // --- CALCULATE NEW STATS ---
    // Ensure submissions and matches are arrays, even if null/undefined
    const submissions = Array.isArray(user.submissions) ? user.submissions : [];
    const matches = Array.isArray(user.matches) ? user.matches : [];

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted').length;

    // Calculate accuracy
    const accuracy = totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
        : "0.0";

    // Calculate matches won/lost
    const totalMatches = matches.length;

    // Find unique room IDs from "Accepted" submissions
    const wonRoomIds = new Set(
        submissions
            .filter(s => s.status === 'Accepted')
            .map(s => s.roomId.toString()) // .toString() handles both string IDs and populated objects
    );

    const matchesWon = wonRoomIds.size;
    const matchesLost = Math.max(0, totalMatches - matchesWon); // Ensure it's not negative

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
                        Accuracy
                    </span>
                    <span className="font-bold text-white">
                        {accuracy}%
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

// 2. Global Leaderboard
const Leaderboard = ({ users, currentUser }) => (
    <GlassCard className="p-6">
        <h3 className="text-2xl font-bold tracking-widest text-cyan-400 mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3" />
            Global Leaderboard
        </h3>
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
                        </li> // <!-- FIX: Added missing closing </li> tag -->
                    );
                })}
            </ul>
        </div>
    </GlassCard>
);


// --- MAIN APP COMPONENT ---

export default function Dashboard() {
    const { getToken, userId, isLoaded } = useAuth(); 

    // Set initial state to null or empty arrays
    const [currentUser, setCurrentUser] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // This is for data fetching
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't fetch data until the auth state is loaded
        if (!isLoaded) {
            return;
        }

        // Fetches all dashboard data when the component mounts
        const fetchDashboardData = async (tokenProvider) => {
            setIsLoading(true);
            setError(null);

            // --- FIX ---
            // Add a base URL for your API. 
            // You MUST change this to your actual backend server address.
            // Example: 'http://localhost:8000' or 'https://api.yourdomain.com'
            const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
            // --- END FIX ---

            try {
                const token = await tokenProvider(); // Get the auth token

                // Fetch data based on User schema.
                const [meRes, leaderboardRes] = await Promise.all([
                    fetch(`${BASE_API_URL}/api/users/me`, { // Prepend base URL
                        headers: { 'Authorization': `Bearer ${token}` } // Send token
                    }),
                    fetch(`${BASE_API_URL}/api/users/leaderboard`, { // Prepend base URL
                        headers: { 'Authorization': `Bearer ${token}` } // Send token
                    })
                ]);

                if (!meRes.ok || !leaderboardRes.ok) {
                    console.error("One or more API requests failed");
                    throw new Error('Failed to fetch all dashboard data.');
                }

                const meData = await meRes.json();
                const leaderboardData = await leaderboardRes.json();

                // Assuming your APIs return data in this structure:
                // meData = { user: { ... } } (a single User object)
                // leaderboardData = { leaderboard: [ ... ] } (an array of User objects)

                // IMPORTANT: Assumes meData.user.submissions is an ARRAY OF OBJECTS
                setCurrentUser(meData.user);
                setLeaderboard(leaderboardData.leaderboard);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message || 'An unknown error occurred.');
                // Set placeholder data on error so page doesn't crash
                setCurrentUser({
                    username: 'Error',
                    rating: 0,
                    matches: [],
                    submissions: [], // Added
                    avatarUrl: 'https://placehold.co/128x128/000000/e00?text=ERR'
                });
                setLeaderboard([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData(getToken); // Pass the getToken function
    }, [isLoaded, getToken]); // Rerun effect if auth state changes

    // Show a loading screen while auth is initializing
    if (!isLoaded) {
        return (
            <div className="relative flex justify-center items-center min-h-screen w-full overflow-hidden font-sans bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-cyan-400 text-2xl tracking-widest animate-pulse">
                    Loading User...
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-hidden font-sans">
            {/* Background */}
            <div
                className="absolute top-0 left-0 w-full h-full 
                   bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10"
            >
            </div>

            {/* Page Header */}
            <header className="w-full p-6 text-center">
                <h1 className="text-5xl font-bold tracking-widest text-white text-shadow-lg"
                    style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.7)' }}>
                    USER DASHBOARD
                </h1>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow w-full max-w-7xl mx-auto p-6">
                {isLoading ? ( // This state is now for data fetching, not auth
                    // Loading State
                    <div className="flex justify-center items-center h-96">
                        <div className="text-cyan-400 text-2xl tracking-widest animate-pulse">
                            Loading Dashboard...
                        </div>
                    </div>
                ) : error ? (
                    // Error State
                    <div className="flex justify-center items-center h-96">
                        <GlassCard className="p-8 text-center">
                            <h2 className="text-2xl text-red-500 mb-4 font-bold">Failed to Load Data</h2>
                            <p className="text-slate-300">{error}</p>
                        </GlassCard>
                    </div>
                ) : currentUser ? (
                    // Success State - Updated Layout
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Column 1: User Profile */}
                        <div className="lg:col-span-1">
                            <UserProfileCard user={currentUser} />
                        </div>

                        {/* Column 2: Leaderboard (takes up remaining space) */}
                        <div className="lg:col-span-2">
                            <Leaderboard users={leaderboard} currentUser={currentUser} />
                        </div>

                    </div>
                ) : (
                    // Empty state
                    <div className="text-center text-slate-400">No data found.</div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full p-4 text-center text-slate-400">
                © 2025 Battle IDE. All rights reserved.
            </footer>
        </div>
    );
}






