import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo (replace with database in production)
interface LeaderboardEntry {
  fid: number;
  username?: string;
  highScore: number;
  totalScore: number;
  gamesPlayed: number;
  lastPlayed: number;
}

const leaderboard: Map<number, LeaderboardEntry> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "free";
    const limit = parseInt(searchParams.get("limit") || "100");

    if (mode === "onchain") {
      // TODO: Fetch from blockchain
      return NextResponse.json({
        mode: "onchain",
        entries: [],
        message: "On-chain leaderboard coming soon!",
      });
    }

    // Get free play leaderboard
    const entries = Array.from(leaderboard.values())
      .sort((a, b) => b.highScore - a.highScore)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json({
      mode: "free",
      entries,
      total: entries.length,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, score } = body;

    if (!fid || typeof score !== "number") {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const existing = leaderboard.get(fid);

    if (existing) {
      // Update existing entry
      existing.highScore = Math.max(existing.highScore, score);
      existing.totalScore += score;
      existing.gamesPlayed += 1;
      existing.lastPlayed = Date.now();
      if (username) existing.username = username;
      leaderboard.set(fid, existing);
    } else {
      // Create new entry
      leaderboard.set(fid, {
        fid,
        username,
        highScore: score,
        totalScore: score,
        gamesPlayed: 1,
        lastPlayed: Date.now(),
      });
    }

    // Calculate rank
    const sortedEntries = Array.from(leaderboard.values())
      .sort((a, b) => b.highScore - a.highScore);

    const rank = sortedEntries.findIndex(e => e.fid === fid) + 1;

    return NextResponse.json({
      success: true,
      rank,
      entry: leaderboard.get(fid),
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
