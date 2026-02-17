"use client";

import { useLeaderboard } from "@/app/hooks/useLeaderboard";
import LeaderboardRow, { ROW_HEIGHT } from "./LeaderboardRow";
import LeaderboardSkeleton from "./LeaderboardSkeleton";

const SDG_COLORS = [
  "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21",
  "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367",
  "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B",
  "#00689D", "#19486A",
];

export default function Leaderboard() {
  const { teams, isLoading, error } = useLeaderboard();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8">
      {/* SDG Color Bar */}
      <div className="flex w-full h-1.5 rounded-full overflow-hidden mb-6 lg:mb-8">
        {SDG_COLORS.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <h1 className="text-3xl lg:text-5xl 2xl:text-6xl font-bold tracking-tight">
          <span className="text-white">Safaricom </span>
          <span style={{ color: "#4CB848" }}>SDG Challenge</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm lg:text-base font-medium">
          Race to 2030 — Accelerating a Digital Future
        </p>
        <p className="text-zinc-500 mt-1 text-xs lg:text-sm">
          Live rankings
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-950/50 border border-red-800/50 px-4 py-3 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* Leaderboard */}
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : (
        <div
          className="relative w-full"
          style={{ height: teams.length * ROW_HEIGHT }}
        >
          {teams.map((team, i) => (
            <LeaderboardRow key={team.team_name} team={team} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
