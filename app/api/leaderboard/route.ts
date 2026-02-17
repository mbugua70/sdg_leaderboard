import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      "https://iguru.co.ke/PLAYGROUND/sdg/points/leaderboard.php",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Upstream API error" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 502 }
    );
  }
}
