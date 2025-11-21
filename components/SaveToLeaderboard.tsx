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
          inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold
          transition-all duration-200 shadow-lg
          ${
            status === "success"
              ? "bg-green-500 text-white border-2 border-green-400"
              : status === "error"
              ? "bg-red-500 text-white border-2 border-red-400"
              : "bg-gradient-to-r from-[#FBCC5C] to-[#35D07F] text-black border-2 border-[#35D07F] hover:shadow-[0_0_30px_#35D07F] hover:scale-105"
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        {status === "saving" ? (
          <>
            <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : status === "success" ? (
          <>
            <Check className="w-6 h-6" />
            Saved to Leaderboard!
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-6 h-6" />
            Try Again
          </>
        ) : (
          <>
            <Save className="w-6 h-6" />
            Save Score ({score} pts)
          </>
        )}
      </button>

      {message && (
        <div
          className={`
            text-sm font-semibold px-4 py-2 rounded-lg
            ${
              status === "success"
                ? "bg-green-500/20 text-green-300 border border-green-500"
                : "bg-red-500/20 text-red-300 border border-red-500"
            }
          `}
        >
          {message}
        </div>
      )}
    </div>
  );
}
