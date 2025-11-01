import React, { useState } from "react";
import vid from "../assets/bg_vid.mp4";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { createRoom, joinRoomByCode } from "../services/api";

const Home = () => {
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const token = await getToken();
      const res = await createRoom(token);
      const roomId = res.data.roomId;
      navigate(`/battle/${roomId}`);
    } catch (err) {
      console.error("Failed to create room", err);
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode) return;

    setIsJoining(true);
    try {
      const token = await getToken();
      const res = await joinRoomByCode(joinCode, token);
      const roomId = res.data.roomId;
      navigate(`/battle/${roomId}`);
    } catch (err) {
      console.error("Failed to join room", err);
      alert("Failed to join room. Please check the code and try again.");
      setIsJoining(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover "
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className=" absolute text-white flex justify-center items-center z-10 h-full w-full">
        <div className="flex flex-col justify-center items-center py-12">
          <h1 className="text-5xl font-bold tracking-widest mb-6 text-shadow-lg">
            BATTLE IDE
          </h1>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="text-3xl bg-gradient-to-r from-black/60 to-white/5 backdrop-blur-lg text-white p-2 px-8 cursor-pointer hover:bg-white/10 rounded-full border-2 border-l-0 border-b-1 border-white/30 filter disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "< Create Room >"}
          </button>

          <div className="text-xl my-4 text-slate-200 tracking-widest">
            — OR —
          </div>

          <form
            onSubmit={handleJoinRoom}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE"
              className="text-lg text-center tracking-widest bg-black/50 backdrop-blur-lg placeholder-white/40 p-3 px-6 rounded-full border-2 border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              disabled={isJoining || !joinCode}
              className="text-lg bg-cyan-600/70 backdrop-blur-lg text-white p-3 px-8 cursor-pointer hover:bg-cyan-500/70 rounded-full border-2 border-cyan-300/30 filter disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? "Joining..." : "Join"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;

