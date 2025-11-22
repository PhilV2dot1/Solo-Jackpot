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
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-[#35D07F] hover:to-[#FBCC5C] rounded-lg font-semibold text-black transition-all shadow-md hover:shadow-lg text-sm"
    >
      <Share2 className="w-4 h-4" />
      Share on Farcaster
    </button>
  );
}
