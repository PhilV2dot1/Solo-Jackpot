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
      // Wait for spin animation to complete
      setTimeout(() => {
        setIsSpinning(false);
      }, 3000);
    } catch (error) {
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = () => {
    // Show result only after reels have stopped
    setShowResult(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FBCC5C] via-[#35D07F] to-[#FBCC5C] text-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header moderne Celo */}
        <div className="text-center mb-8">
          <div className="bg-black/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-4 border-[#35D07F]">
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#FBCC5C] via-white to-[#35D07F] bg-clip-text text-transparent">
              CRYPTO JACKPOT
            </h1>
            <p className="text-[#35D07F] text-lg font-semibold">Spin & Win on Celo Blockchain</p>

            {/* Score Display */}
            <div className="mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-[#35D07F]/20 to-[#FBCC5C]/20 rounded-2xl p-4 border-2 border-[#FBCC5C]">
              <Trophy className="w-8 h-8 text-[#FBCC5C]" />
              <span className="text-4xl font-black bg-gradient-to-r from-[#FBCC5C] to-[#35D07F] bg-clip-text text-transparent">
                {totalScore}
              </span>
              <span className="text-white font-bold">POINTS</span>
            </div>
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
        <div className="bg-black/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-[#35D07F]">
          <JackpotMachine
            isSpinning={isSpinning}
            finalValue={lastResult?.score}
            onSpinComplete={handleSpinComplete}
          />

          <div className="mt-8 flex flex-col items-center gap-4">
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
          <div className="mt-8 text-center">
            <SaveToLeaderboard score={totalScore} disabled={isSpinning} />
          </div>
        )}

        {/* Leaderboard Link moderne */}
        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-3 bg-black/90 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all border-2 border-[#35D07F] hover:border-[#FBCC5C] hover:shadow-[0_0_30px_#35D07F]"
          >
            <Trophy className="w-6 h-6 text-[#FBCC5C]" />
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
