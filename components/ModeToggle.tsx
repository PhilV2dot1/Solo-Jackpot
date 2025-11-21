"use client";

import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: "free" | "onchain";
  setMode: (mode: "free" | "onchain") => void;
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-full p-1 flex gap-1">
        <button
          onClick={() => setMode("free")}
          className={cn(
            "px-6 py-2 rounded-full font-semibold transition-all duration-200",
            mode === "free"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              : "text-gray-300 hover:text-white"
          )}
        >
          🎮 Free Play
        </button>
        <button
          onClick={() => setMode("onchain")}
          className={cn(
            "px-6 py-2 rounded-full font-semibold transition-all duration-200",
            mode === "onchain"
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
              : "text-gray-300 hover:text-white"
          )}
        >
          ⛓️ On-Chain
        </button>
      </div>
    </div>
  );
}
