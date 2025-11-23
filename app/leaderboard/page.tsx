"use client";

import { useEffect, useState, useCallback } from "react";
import { Trophy, Medal, Award, Home } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  fid: number;
  username?: string;
  highScore: number;
  totalScore: number;
  gamesPlayed: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [mode, setMode] = useState<"free" | "onchain">("free");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?mode=${mode}&limit=50`);
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="text-gray-700 font-bold text-sm">#{rank}</span>;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-[#FCFF52]/30 text-gray-900">
      <div className="container mx-auto px-3 py-4 max-w-md">
        {/* Header compact */}
        <div className="text-center mb-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border-2 border-gray-700" style={{ boxShadow: '0 0 0 6px #FCFF52, 0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-[#FCFF52] to-gray-900 bg-clip-text text-transparent drop-shadow-sm">
              🏆 LEADERBOARD
            </h1>
          </div>
        </div>

        {/* Mode Toggle compact */}
        <div className="mb-4 flex justify-center">
          <div className="bg-white/95 backdrop-blur-lg rounded-full p-1 flex gap-1 border-2 border-[#FCFF52]">
            <button
              onClick={() => setMode("free")}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                mode === "free"
                  ? "bg-gray-800 text-white shadow-lg border border-[#FCFF52]"
                  : "text-gray-700 hover:text-gray-900 font-bold"
              }`}
            >
              Free Play
            </button>
            <button
              onClick={() => setMode("onchain")}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                mode === "onchain"
                  ? "bg-gray-800 text-white shadow-lg border border-[#FCFF52]"
                  : "text-gray-700 hover:text-gray-900 font-bold"
              }`}
            >
              On-Chain
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
              <p className="mt-3 text-gray-700 text-sm">Loading...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p className="text-gray-700">No entries yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.fid}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-[#FCFF52]/40 to-gray-100 border-2 border-[#FCFF52]"
                      : "bg-white/50 hover:bg-white/70 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {entry.username || `Player #${entry.fid}`}
                      </div>
                      <div className="text-xs text-gray-600">
                        {entry.gamesPlayed} games
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#FBCC5C]">
                      {entry.highScore}
                    </div>
                    <div className="text-xs text-gray-600">
                      Total: {entry.totalScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm border-2 border-[#FCFF52] hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Back to Game
          </Link>
        </div>
      </div>
    </main>
  );
}
