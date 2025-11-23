import { useState, useCallback } from "react";
import { GameResult } from "@/components/ResultDisplay";
import { getFarcasterUser } from "@/lib/farcaster";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { LEADERBOARD_ABI, LEADERBOARD_ADDRESS } from "@/lib/contract-abi";

export type GameState = "idle" | "spinning" | "revealing" | "result";
export type GameMode = "free" | "onchain";

// Gains basés sur Market Cap crypto (BTC = le plus élevé)
const WHEEL_OUTCOMES = [
  { points: 1000, weight: 2, isJackpot: true },  // BTC - Jackpot! (Rank #1)
  { points: 500, weight: 5, isJackpot: false },  // ETH (Rank #2)
  { points: 250, weight: 8, isJackpot: false },  // XRP (Rank #3)
  { points: 100, weight: 12, isJackpot: false }, // BNB (Rank #4)
  { points: 50, weight: 15, isJackpot: false },  // SOL (Rank #5)
  { points: 25, weight: 18, isJackpot: false },  // CELO (Rank #6)
  { points: 10, weight: 20, isJackpot: false },  // OP (Rank #7)
  { points: 0, weight: 20, isJackpot: false },   // MISS - Lose
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

  // Wagmi hooks for contract interaction
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const spin = useCallback(async () => {
    setState("spinning");

    try {
      if (mode === "free") {
        // Free play: Instant result with off-chain RNG
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate spin time
        const result = getRandomOutcome();

        // Submit to free play API
        const farcasterUser = await getFarcasterUser();
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

        // Delay totalScore update to match visual sequence completion
        // Visual sequence: 1.5s spin stop + 0.9s settling + 0.5s result display = 2.9s
        // Update total at 3.5s to ensure it appears AFTER result is visible
        setTimeout(() => {
          setTotalScore(prev => prev + result.score);
        }, 3500);
      } else {
        // On-chain mode: Use smart contract
        if (!isConnected || !address) {
          throw new Error("Wallet not connected");
        }

        const farcasterUser = await getFarcasterUser();
        if (!farcasterUser) {
          throw new Error("Farcaster user not found");
        }

        try {
          // Step 1: Start party (create session) and get session ID from return value
          // Note: We'll need to read the sessionId from the contract after transaction
          const startTx = await writeContractAsync({
            address: LEADERBOARD_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: "startParty",
            args: [BigInt(farcasterUser.fid)],
          });

          console.log("Party started, tx hash:", startTx);

          // For now, we'll simulate the game and save session ID for next implementation
          // In production, you'd want to read the PartyStarted event to get the sessionId

          // Step 2: Simulate spin
          await new Promise(resolve => setTimeout(resolve, 3000));
          const result = getRandomOutcome();

          // Step 3: Submit score if player won
          // Note: For now we skip submitScore until we can properly read the sessionId from events
          // This requires using useWaitForTransactionReceipt and reading logs
          if (result.score > 0) {
            console.log("Score achieved:", result.score, "- Will implement submitScore with event reading");
          }

          setState("result");
          setLastResult(result);

          // Delay totalScore update to match visual sequence completion
          setTimeout(() => {
            setTotalScore(prev => prev + result.score);
          }, 3500);
        } catch (contractError) {
          console.error("Contract error:", contractError);
          throw contractError;
        }
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
