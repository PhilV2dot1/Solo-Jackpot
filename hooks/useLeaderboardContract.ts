"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { LEADERBOARD_ABI, LEADERBOARD_ADDRESS } from "@/lib/leaderboard";
import type { Log } from "viem";

/**
 * Hook to interact with the SoloJackpotLeaderboard smart contract
 */
export function useLeaderboardContract() {
  const { address, isConnected } = useAccount();
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [actionType, setActionType] = useState<"startParty" | "submitScore" | null>(
    null
  );
  const publicClient = usePublicClient();

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Extract sessionId from PartyStarted event when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && receipt && actionType === "startParty") {
      const logs = receipt.logs as Log[];
      // Find PartyStarted event
      const partyStartedLog = logs.find(
        (log) =>
          log.address.toLowerCase() === LEADERBOARD_ADDRESS.toLowerCase() &&
          log.topics[0] ===
            "0x" +
              Array.from(
                new TextEncoder().encode(
                  "PartyStarted(uint256,uint256,address)"
                )
              )
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
      );

      if (partyStartedLog && partyStartedLog.topics[1]) {
        // First indexed parameter is sessionId
        const extractedSessionId = BigInt(partyStartedLog.topics[1]);
        setSessionId(extractedSessionId);
        console.log("Session started with ID:", extractedSessionId.toString());
      }
    }
  }, [isConfirmed, receipt, actionType]);

  /**
   * Start a new game session on-chain
   * @param fid Farcaster ID
   * @returns Promise that resolves when transaction is submitted
   */
  const startParty = async (fid: number): Promise<void> => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      setActionType("startParty");
      setSessionId(null); // Reset previous session
      await writeContract({
        address: LEADERBOARD_ADDRESS,
        abi: LEADERBOARD_ABI,
        functionName: "startParty",
        args: [BigInt(fid)],
      });
    } catch (error) {
      console.error("Error starting party:", error);
      setActionType(null);
      throw error;
    }
  };

  /**
   * Submit score to the blockchain using the current tracked sessionId
   * @param score Final score
   */
  const submitScore = async (score: number): Promise<void> => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    if (!sessionId) {
      throw new Error("No active session. Please start a party first.");
    }

    try {
      setActionType("submitScore");
      await writeContract({
        address: LEADERBOARD_ADDRESS,
        abi: LEADERBOARD_ABI,
        functionName: "submitScore",
        args: [sessionId, BigInt(score)],
      });
    } catch (error) {
      console.error("Error submitting score:", error);
      setActionType(null);
      throw error;
    }
  };

  /**
   * Reset the hook state (useful when switching modes or starting fresh)
   */
  const resetSession = () => {
    setSessionId(null);
    setActionType(null);
    reset();
  };

  return {
    // State
    address,
    isConnected,
    sessionId,
    hasActiveSession: sessionId !== null,
    actionType,

    // Write operations
    startParty,
    submitScore,
    resetSession,

    // Transaction state
    hash,
    isPending: isWritePending || isConfirming,
    isConfirmed,
    isStartingParty: actionType === "startParty" && (isWritePending || isConfirming),
    isSubmittingScore:
      actionType === "submitScore" && (isWritePending || isConfirming),
    error: writeError,
  };
}
