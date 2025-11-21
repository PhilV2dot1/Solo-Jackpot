"use client";

import { shareOnFarcaster } from "@/lib/farcaster";
import { Share2 } from "lucide-react";

interface FarcasterShareProps {
  score: number;
}

export function FarcasterShare({ score }: FarcasterShareProps) {
  const handleShare = async () => {
    const text = `I just scored ${score} points in Solo Jackpot! 🎰✨ Can you beat my score?`;
    const appUrl = typeof window !== "undefined" ? window.location.href : "";

    await shareOnFarcaster(text, [appUrl]);
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
    >
      <Share2 className="w-5 h-5" />
      Share on Farcaster
    </button>
  );
}
