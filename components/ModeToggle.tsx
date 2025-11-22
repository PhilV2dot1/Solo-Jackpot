"use client";

import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: "free" | "onchain";
  setMode: (mode: "free" | "onchain") => void;
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="bg-white/95 backdrop-blur-lg rounded-full p-1 flex gap-1 border-2 border-gray-300">
        <button
          onClick={() => setMode("free")}
          className={cn(
            "px-6 py-2 rounded-full font-semibold transition-all duration-200",
            mode === "free"
              ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          🎮 Free Play
        </button>
        <button
          onClick={() => setMode("onchain")}
          className={cn(
            "px-6 py-2 rounded-full font-semibold transition-all duration-200",
            mode === "onchain"
              ? "bg-gradient-to-r from-[#FCFF52] to-yellow-400 text-gray-900 shadow-lg"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          ⛓️ On-Chain
        </button>
      </div>
    </div>
  );
}
