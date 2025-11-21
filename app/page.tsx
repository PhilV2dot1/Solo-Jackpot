"use client";

import { useState } from "react";
import { JackpotMachine } from "@/components/JackpotMachine";
import { SpinButton } from "@/components/SpinButton";
import { ResultDisplay } from "@/components/ResultDisplay";
import { ModeToggle } from "@/components/ModeToggle";
import { WalletConnect } from "@/components/WalletConnect";
import { FarcasterShare } from "@/components/FarcasterShare";
import { useGame } from "@/hooks/useGame";
import { Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const {
    state,
    mode,
    setMode,
    spin,
    lastResult,
    totalScore
  } = useGame();

  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async () => {
    setIsSpinning(true);
    try {
      await spin();
    } finally {
      setTimeout(() => setIsSpinning(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Solo Jackpot 🎰
          </h1>
          <p className="text-gray-300">Spin the wheel and win big!</p>

          {/* Score Display */}
          <div className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400">
            <Trophy className="w-6 h-6" />
            {totalScore} points
          </div>
        </div>

        {/* Mode Toggle */}
        <ModeToggle mode={mode} setMode={setMode} />

        {/* Wallet Connect (On-Chain Mode Only) */}
        {mode === "onchain" && (
          <div className="mb-6">
            <WalletConnect />
          </div>
        )}

        {/* Game Area */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-yellow-500/30">
          <JackpotMachine
            isSpinning={isSpinning}
            finalValue={lastResult?.score}
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            <SpinButton
              onClick={handleSpin}
              disabled={isSpinning || state === "spinning"}
              mode={mode}
            />

            {lastResult && state === "result" && (
              <ResultDisplay result={lastResult} />
            )}

            {lastResult && state === "result" && (
              <FarcasterShare score={lastResult.score} />
            )}
          </div>
        </div>

        {/* Leaderboard Link */}
        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
