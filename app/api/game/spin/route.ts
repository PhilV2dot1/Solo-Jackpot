import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo (replace with database in production)
const scores: Map<number, { fid: number; score: number; timestamp: number }[]> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, mode, score } = body;

    if (!fid || mode !== "free" || typeof score !== "number") {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Store the score
    const userScores = scores.get(fid) || [];
    userScores.push({
      fid,
      score,
      timestamp: Date.now(),
    });
    scores.set(fid, userScores);

    return NextResponse.json({
      success: true,
      score,
      totalGames: userScores.length,
    });
  } catch (error) {
    console.error("Error processing spin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
