"use client";

import { useState } from "react";
import { Trophy, Save, Check, AlertCircle } from "lucide-react";
import { getFarcasterUser } from "@/lib/farcaster";

interface SaveToLeaderboardProps {
  score: number;
  disabled?: boolean;
}

export function SaveToLeaderboard({ score, disabled }: SaveToLeaderboardProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [rank, setRank] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (score === 0) {
      setMessage("Score must be greater than 0!");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      // Get Farcaster user info
      const user = await getFarcasterUser();

      if (!user) {
        setMessage("Please connect your Farcaster account first!");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }

      // Save to leaderboard
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fid: user.fid,
          username: user.username || user.displayName,
          score: score,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score");
      }

      const data = await response.json();

      if (data.success) {
        setRank(data.rank);
        setMessage(`Saved! You're rank #${data.rank}`);
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        throw new Error("Failed to save score");
      }
    } catch (error) {
      console.error("Error saving to leaderboard:", error);
      setMessage("Failed to save score. Try again!");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleSave}
        disabled={disabled || status === "saving" || status === "success"}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
          transition-all duration-200 shadow-md
          ${
            status === "success"
              ? "bg-gray-800 text-white border border-gray-700"
              : status === "error"
              ? "bg-red-500 text-white border border-red-400"
              : "bg-gradient-to-r from-gray-700 to-gray-900 text-black border border-[#35D07F] hover:scale-105"
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        {status === "saving" ? (
          <>
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : status === "success" ? (
          <>
            <Check className="w-5 h-5" />
            Saved! Rank #{rank}
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-5 h-5" />
            Try Again
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Score
          </>
        )}
      </button>

      {message && status === "error" && (
        <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500">
          {message}
        </div>
      )}
    </div>
  );
}
