"use client";

import { useState, useEffect } from "react";
import { JackpotMachine } from "@/components/JackpotMachine";
import { SpinButton } from "@/components/SpinButton";
import { ResultDisplay } from "@/components/ResultDisplay";
import { ModeToggle } from "@/components/ModeToggle";
import { WalletConnect } from "@/components/WalletConnect";
import { FarcasterShare } from "@/components/FarcasterShare";
import { SaveToLeaderboard } from "@/components/SaveToLeaderboard";
import { useGame } from "@/hooks/useGame";
import { useLeaderboardContract } from "@/hooks/useLeaderboardContract";
import { getFarcasterUser } from "@/lib/farcaster";
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

  const {
    startParty,
    hasActiveSession,
    isStartingParty,
    sessionId,
    resetSession,
    isConnected,
  } = useLeaderboardContract();

  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Reset session when switching modes
  useEffect(() => {
    if (mode === "free") {
      resetSession();
    }
  }, [mode, resetSession]);

  const handleSpin = async () => {
    setIsSpinning(true);
    setShowResult(false);

    try {
      // For on-chain mode, start a party if no active session
      if (mode === "onchain" && !hasActiveSession) {
        const user = await getFarcasterUser();
        if (!user) {
          alert("Please connect your Farcaster account first!");
          setIsSpinning(false);
          return;
        }

        if (!isConnected) {
          alert("Please connect your wallet first!");
          setIsSpinning(false);
          return;
        }

        // Start a new party (session) on-chain
        try {
          await startParty(user.fid);
          console.log("Party started! Session will be tracked once confirmed.");
        } catch (error) {
          console.error("Failed to start party:", error);
          alert("Failed to start game session. Please try again.");
          setIsSpinning(false);
          return;
        }
      }

      await spin();
      // Optimized for 3s total: 2s spin + 0.7s settling + 0.3s result delay
      setTimeout(() => {
        setIsSpinning(false);
      }, 2000);
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = () => {
    // Only show result if not currently spinning
    if (!isSpinning) {
      // Optimized 300ms delay for 3s total gameplay cycle
      // Sequence: Reels stop → Visual result visible → Points displayed → Score updates
      setTimeout(() => {
        setShowResult(true);
      }, 300);
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
          <div className="mb-3 space-y-2">
            <WalletConnect />
            {/* Session Status Indicator */}
            {isConnected && (
              <div className="text-center">
                {hasActiveSession && sessionId ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg text-xs font-semibold text-green-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active Session #{sessionId.toString()}
                  </div>
                ) : isStartingParty ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg text-xs font-semibold text-yellow-300">
                    <div className="w-2 h-2 border border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    Starting Session...
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 border border-gray-500 rounded-lg text-xs font-semibold text-gray-300">
                    No Active Session
                  </div>
                )}
              </div>
            )}
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
              disabled={isSpinning || state === "spinning" || isStartingParty}
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
            <SaveToLeaderboard
              score={totalScore}
              disabled={isSpinning}
              mode={mode}
            />
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
