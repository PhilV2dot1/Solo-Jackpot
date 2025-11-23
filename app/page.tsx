"use client";

import { useState, useRef, useEffect } from "react";
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

  // Refs to store timeout IDs for cleanup
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, []);

  const handleSpin = async () => {
    // Clear any existing timeouts to prevent conflicts
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);

    setIsSpinning(true);
    setShowResult(false);

    try {
      await spin();
      // Ultra-fast spin time (0.8s spin + 1s settling = 1.8s total)
      spinTimeoutRef.current = setTimeout(() => {
        setIsSpinning(false);
        spinTimeoutRef.current = null;
      }, 800);
    } catch (error) {
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = () => {
    // Clear any existing result timeout
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);

    // Only show result if not currently spinning
    if (!isSpinning) {
      // Short delay for visual confirmation after reels stop (500ms)
      // Sequence: Reels stop → Visual result visible → Points displayed → Score updates
      resultTimeoutRef.current = setTimeout(() => {
        setShowResult(true);
        resultTimeoutRef.current = null;
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-[#FCFF52]/30 text-gray-900">
      <div className="container mx-auto px-3 py-4 max-w-md">
        {/* Header - Professional Design */}
        <div className="text-center mb-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border-2 border-gray-700" style={{ boxShadow: '0 0 0 6px #FCFF52, 0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h1 className="text-4xl font-black mb-3 tracking-tight leading-tight">
              <span className="text-gray-900">CRYPTO</span>
              <span className="text-[#FCFF52] mx-2">JACKPOT</span>
            </h1>

            {/* Score Display */}
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-3 border-2 border-[#FCFF52] shadow-lg">
              <Trophy className="w-6 h-6 text-[#FCFF52]" />
              <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {totalScore}
              </span>
              <span className="text-[#FCFF52] text-sm font-bold">PTS</span>
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

        {/* Game Area - Professional */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border-2 border-gray-700" style={{ boxShadow: '0 0 0 6px #FCFF52, 0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <JackpotMachine
            isSpinning={isSpinning}
            finalValue={lastResult?.score}
            onSpinComplete={handleSpinComplete}
            onSpin={handleSpin}
            disabled={isSpinning || state === "spinning"}
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

        {/* Leaderboard Link */}
        <div className="mt-4 text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 border-[#FCFF52] hover:border-[#FCFF52] shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Trophy className="w-5 h-5 text-[#FCFF52]" />
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
