"use client";

import { useState } from "react";
import { JackpotMachine } from "@/components/JackpotMachine";
import { SpinButton } from "@/components/SpinButton";
import { ResultDisplay } from "@/components/ResultDisplay";
import { ModeToggle } from "@/components/ModeToggle";
import { WalletConnect } from "@/components/WalletConnect";
import { FarcasterShare } from "@/components/FarcasterShare";
import { SaveToLeaderboard } from "@/components/SaveToLeaderboard";
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

  const [showResult, setShowResult] = useState(false);

  const handleSpin = async () => {
    setIsSpinning(true);
    setShowResult(false);
    try {
      await spin();
      // Wait for spin animation to complete (3s spin + 1.5s settling + 0.8s suspense = 5.3s total)
      setTimeout(() => {
        setIsSpinning(false);
      }, 3000);
    } catch (error) {
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = () => {
    // Only show result if not currently spinning
    if (!isSpinning) {
      // Add delay to ensure all reels have fully settled (1400ms) + suspense (800ms)
      setTimeout(() => {
        setShowResult(true);
      }, 1500); // Increased delay to ensure reels fully stop before reveal
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFF52] text-gray-900">
      <div className="container mx-auto px-3 py-4 max-w-md">
        {/* Header compact - Mobile optimized */}
        <div className="text-center mb-4">
          <div className="bg-black/90 backdrop-blur-lg rounded-2xl p-3 shadow-xl border-2 border-[#35D07F]">
            <h1 className="text-3xl font-black mb-3 bg-gradient-to-r from-[#FBCC5C] via-white to-[#35D07F] bg-clip-text text-transparent">
              CRYPTO JACKPOT
            </h1>

            {/* Score Display compact */}
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#35D07F]/20 to-[#FBCC5C]/20 rounded-xl p-2 border border-[#FBCC5C]">
              <Trophy className="w-5 h-5 text-[#FBCC5C]" />
              <span className="text-2xl font-black bg-gradient-to-r from-[#FBCC5C] to-[#35D07F] bg-clip-text text-transparent">
                {totalScore}
              </span>
              <span className="text-white text-sm font-bold">PTS</span>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <ModeToggle mode={mode} setMode={setMode} />

        {/* Wallet Connect (On-Chain Mode Only) */}
        {mode === "onchain" && (
          <div className="mb-3">
            <WalletConnect />
          </div>
        )}

        {/* Game Area simplifié */}
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border-2 border-[#35D07F]">
          <JackpotMachine
            isSpinning={isSpinning}
            finalValue={lastResult?.score}
            onSpinComplete={handleSpinComplete}
          />

          <div className="mt-4 flex flex-col items-center gap-3">
            <SpinButton
              onClick={handleSpin}
              disabled={isSpinning || state === "spinning"}
              mode={mode}
            />

            {lastResult && showResult && (
              <ResultDisplay result={lastResult} />
            )}

            {lastResult && showResult && (
              <FarcasterShare score={lastResult.score} />
            )}
          </div>
        </div>

        {/* Save to Leaderboard Button */}
        {totalScore > 0 && (
          <div className="mt-4 text-center">
            <SaveToLeaderboard score={totalScore} disabled={isSpinning} />
          </div>
        )}

        {/* Leaderboard Link compact */}
        <div className="mt-4 text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 bg-black/90 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 border-[#35D07F] hover:border-[#FBCC5C]"
          >
            <Trophy className="w-5 h-5 text-[#FBCC5C]" />
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
