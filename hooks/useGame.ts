import { useState, useCallback } from "react";
import { GameResult } from "@/components/ResultDisplay";
import { getFarcasterUser } from "@/lib/farcaster";

export type GameState = "idle" | "spinning" | "revealing" | "result";
export type GameMode = "free" | "onchain";

const WHEEL_OUTCOMES = [
  { points: 10, weight: 25, isJackpot: false },
  { points: 25, weight: 20, isJackpot: false },
  { points: 50, weight: 15, isJackpot: false },
  { points: 100, weight: 15, isJackpot: false },
  { points: 250, weight: 10, isJackpot: false },
  { points: 500, weight: 8, isJackpot: false },
  { points: 1000, weight: 2, isJackpot: true }, // Jackpot!
  { points: 0, weight: 5, isJackpot: false }, // Lose
];

function getRandomOutcome(): GameResult {
  const totalWeight = WHEEL_OUTCOMES.reduce((sum, outcome) => sum + outcome.weight, 0);
  let random = Math.random() * totalWeight;

  for (const outcome of WHEEL_OUTCOMES) {
    random -= outcome.weight;
    if (random <= 0) {
      return {
        score: outcome.points,
        isJackpot: outcome.isJackpot,
        badge: outcome.points >= 500 ? "Gold" : outcome.points >= 100 ? "Silver" : undefined,
      };
    }
  }

  return { score: 0, isJackpot: false };
}

export function useGame() {
  const [state, setState] = useState<GameState>("idle");
  const [mode, setMode] = useState<GameMode>("free");
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionId, setSessionId] = useState<bigint | null>(null);

  const spin = useCallback(async () => {
    setState("spinning");

    try {
      if (mode === "free") {
        // Free play: Instant result with off-chain RNG
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate spin time
        const result = getRandomOutcome();

        // Submit to free play API
        const farcasterUser = getFarcasterUser();
        if (farcasterUser) {
          await fetch("/api/game/spin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fid: farcasterUser.fid,
              mode: "free",
              score: result.score,
            }),
          }).catch(err => console.error("Failed to save free play result:", err));
        }

        setState("result");
        setLastResult(result);
        setTotalScore(prev => prev + result.score);
      } else {
        // On-chain mode: Will be implemented with smart contract
        await new Promise(resolve => setTimeout(resolve, 3000));
        const result = getRandomOutcome();

        // TODO: Submit to blockchain
        console.log("On-chain spin result:", result);

        setState("result");
        setLastResult(result);
        setTotalScore(prev => prev + result.score);
      }
    } catch (error) {
      console.error("Spin error:", error);
      setState("idle");
    }
  }, [mode]);

  const resetGame = useCallback(() => {
    setState("idle");
    setLastResult(null);
  }, []);

  return {
    state,
    mode,
    setMode,
    spin,
    lastResult,
    totalScore,
    sessionId,
    resetGame,
  };
}
