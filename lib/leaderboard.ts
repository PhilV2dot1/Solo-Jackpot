import { createPublicClient, http, type Address } from "viem";
import { celo } from "viem/chains";

// Contract ABI for SoloJackpotLeaderboard
export const LEADERBOARD_ABI = [
  {
    type: "function",
    name: "startParty",
    stateMutability: "nonpayable",
    inputs: [{ name: "_fid", type: "uint256" }],
    outputs: [{ name: "sessionId", type: "uint256" }],
  },
  {
    type: "function",
    name: "submitScore",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_sessionId", type: "uint256" },
      { name: "_score", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getTopScores",
    stateMutability: "view",
    inputs: [{ name: "_limit", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "fid", type: "uint256" },
          { name: "player", type: "address" },
          { name: "score", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "completed", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getUserSessions",
    stateMutability: "view",
    inputs: [{ name: "_fid", type: "uint256" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getSession",
    stateMutability: "view",
    inputs: [{ name: "_sessionId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "fid", type: "uint256" },
          { name: "player", type: "address" },
          { name: "score", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "completed", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getLeaderboardSize",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "sessionCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "PartyStarted",
    inputs: [
      { name: "sessionId", type: "uint256", indexed: true },
      { name: "fid", type: "uint256", indexed: true },
      { name: "player", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "ScoreSubmitted",
    inputs: [
      { name: "sessionId", type: "uint256", indexed: true },
      { name: "fid", type: "uint256", indexed: true },
      { name: "score", type: "uint256" },
      { name: "rank", type: "uint256" },
    ],
  },
] as const;

// TypeScript types matching Solidity structs
export interface GameSession {
  fid: bigint;
  player: Address;
  score: bigint;
  timestamp: bigint;
  completed: boolean;
}

export interface LeaderboardEntry {
  fid: number;
  username?: string;
  highScore: number;
  totalScore: number;
  gamesPlayed: number;
  rank: number;
}

// Contract address from environment
export const LEADERBOARD_ADDRESS = (process.env
  .NEXT_PUBLIC_LEADERBOARD_ADDRESS || "") as Address;

// Create public client for reading from Celo Mainnet
export const publicClient = createPublicClient({
  chain: celo,
  transport: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org"),
});

/**
 * Fetch top scores from the blockchain
 * @param limit Number of top scores to fetch
 * @returns Array of game sessions from the blockchain
 */
export async function getTopScoresFromChain(
  limit: number = 100
): Promise<GameSession[]> {
  try {
    const sessions = (await publicClient.readContract({
      address: LEADERBOARD_ADDRESS,
      abi: LEADERBOARD_ABI,
      functionName: "getTopScores",
      args: [BigInt(limit)],
    })) as GameSession[];

    return sessions;
  } catch (error) {
    console.error("Error fetching top scores from chain:", error);
    return [];
  }
}

/**
 * Get user's session IDs from the blockchain
 * @param fid Farcaster ID
 * @returns Array of session IDs
 */
export async function getUserSessionsFromChain(fid: number): Promise<bigint[]> {
  try {
    const sessionIds = (await publicClient.readContract({
      address: LEADERBOARD_ADDRESS,
      abi: LEADERBOARD_ABI,
      functionName: "getUserSessions",
      args: [BigInt(fid)],
    })) as bigint[];

    return sessionIds;
  } catch (error) {
    console.error("Error fetching user sessions from chain:", error);
    return [];
  }
}

/**
 * Get a specific session from the blockchain
 * @param sessionId Session ID
 * @returns GameSession or null
 */
export async function getSessionFromChain(
  sessionId: bigint
): Promise<GameSession | null> {
  try {
    const session = (await publicClient.readContract({
      address: LEADERBOARD_ADDRESS,
      abi: LEADERBOARD_ABI,
      functionName: "getSession",
      args: [sessionId],
    })) as GameSession;

    return session;
  } catch (error) {
    console.error("Error fetching session from chain:", error);
    return null;
  }
}

/**
 * Convert blockchain GameSessions to LeaderboardEntry format
 * Aggregates multiple sessions per FID to calculate totalScore and gamesPlayed
 * @param sessions Array of GameSession from blockchain
 * @returns Array of LeaderboardEntry
 */
export function convertSessionsToLeaderboard(
  sessions: GameSession[]
): LeaderboardEntry[] {
  // Group sessions by FID and aggregate
  const fidMap = new Map<number, LeaderboardEntry>();

  sessions.forEach((session) => {
    const fid = Number(session.fid);
    const score = Number(session.score);

    if (fidMap.has(fid)) {
      const entry = fidMap.get(fid)!;
      entry.highScore = Math.max(entry.highScore, score);
      entry.totalScore += score;
      entry.gamesPlayed += 1;
    } else {
      fidMap.set(fid, {
        fid,
        highScore: score,
        totalScore: score,
        gamesPlayed: 1,
        rank: 0, // Will be set later
      });
    }
  });

  // Convert to array and sort by highScore
  const entries = Array.from(fidMap.values()).sort(
    (a, b) => b.highScore - a.highScore
  );

  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}
