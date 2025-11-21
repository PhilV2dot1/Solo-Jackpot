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
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-300">Top players ranked by high score</p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-1 flex gap-1">
            <button
              onClick={() => setMode("free")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                mode === "free"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🎮 Free Play
            </button>
            <button
              onClick={() => setMode("onchain")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                mode === "onchain"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              ⛓️ On-Chain
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              <p className="mt-4 text-gray-300">Loading leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 text-lg">No entries yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.fid}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {entry.username || `Player #${entry.fid}`}
                      </div>
                      <div className="text-sm text-gray-400">
                        {entry.gamesPlayed} games played
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">
                      {entry.highScore}
                    </div>
                    <div className="text-sm text-gray-400">
                      Total: {entry.totalScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Back to Game
          </Link>
        </div>
      </div>
    </main>
  );
}
