"use client";

import { useState, useEffect } from "react";
import { Trophy, Save, Check, AlertCircle } from "lucide-react";
import { getFarcasterUser } from "@/lib/farcaster";
import { useLeaderboardContract } from "@/hooks/useLeaderboardContract";

interface SaveToLeaderboardProps {
  score: number;
  disabled?: boolean;
  mode?: "free" | "onchain";
}

export function SaveToLeaderboard({
  score,
  disabled,
  mode = "free",
}: SaveToLeaderboardProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );
  const [rank, setRank] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // On-chain contract interaction
  const {
    isConnected,
    submitScore: submitScoreToChain,
    isPending,
    isConfirmed,
    error: contractError,
    hasActiveSession,
    sessionId,
  } = useLeaderboardContract();

  // Watch for on-chain transaction confirmation
  useEffect(() => {
    if (mode === "onchain" && isConfirmed && status === "saving") {
      setStatus("success");
      setMessage("Score saved on-chain!");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  }, [isConfirmed, mode, status]);

  // Watch for on-chain transaction errors
  useEffect(() => {
    if (mode === "onchain" && contractError && status === "saving") {
      setStatus("error");
      setMessage("Transaction failed. Try again!");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [contractError, mode, status]);

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

      // Handle on-chain mode
      if (mode === "onchain") {
        if (!isConnected) {
          setMessage("Please connect your wallet first!");
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
          return;
        }

        if (!hasActiveSession || !sessionId) {
          setMessage("No active game session. Please play a game first!");
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
          return;
        }

        // Submit score using the tracked sessionId from the contract hook
        await submitScoreToChain(score);
        // Transaction state is handled by useEffect watching isConfirmed
        return;
      }

      // Free mode - save via API
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fid: user.fid,
          username: user.username || user.displayName,
          score: score,
          mode: "free",
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
              ? "bg-green-500 text-white border border-green-400"
              : status === "error"
              ? "bg-red-500 text-white border border-red-400"
              : "bg-gradient-to-r from-[#FBCC5C] to-[#35D07F] text-black border border-[#35D07F] hover:scale-105"
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        {status === "saving" || isPending ? (
          <>
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            {mode === "onchain" ? "Confirming..." : "Saving..."}
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
