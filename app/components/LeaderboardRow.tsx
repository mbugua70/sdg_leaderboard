"use client";

import { useState, useCallback } from "react";
import type { TeamData } from "@/app/types/leaderboard";
import AnimatedNumber from "./AnimatedNumber";

interface LeaderboardRowProps {
  team: TeamData;
  index: number;
}

export default function LeaderboardRow({ team, index }: LeaderboardRowProps) {
  const [flashing, setFlashing] = useState(team.pointsChanged);

  const handleAnimationEnd = useCallback(() => {
    setFlashing(false);
  }, []);

  // Re-trigger flash when pointsChanged becomes true
  if (team.pointsChanged && !flashing) {
    setFlashing(true);
  }

  const isLeader = team.rank === 1;
  const isSecond = team.rank === 2;
  const isThird  = team.rank === 3;

  // Outer div is a flex child in the sled (flex-1 = equal share of sled height)
  return (
    <div
      className="flex-1 min-h-0 px-2 lg:px-4 py-0.5"
    >
      <div
        className={`
          h-full flex items-center gap-3 lg:gap-6 rounded-xl px-4 lg:px-8
          transition-all duration-300 backdrop-blur-sm
          animate-slide-in
          ${
            isLeader
              ? "leader-card scale-x-[1.02] lg:scale-x-[1.03]"
              : isSecond
                ? "border border-blue-400/30 bg-blue-950/30"
                : isThird
                  ? "border border-amber-500/30 bg-amber-950/20"
                  : "border border-white/5 bg-white/[0.03]"
          }
          ${flashing ? "animate-points-flash" : ""}
        `}
        style={{ animationDelay: `${index * 80}ms` }}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Rank */}
        <div
          className={`
            flex-shrink-0 flex items-center justify-center rounded-lg font-bold
            w-10 h-10 lg:w-12 lg:h-12 text-lg lg:text-2xl
            ${
              isLeader
                ? "bg-green-500/20 text-green-300"
                : isSecond
                  ? "bg-blue-500/20 text-blue-300"
                  : isThird
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-white/5 text-zinc-500"
            }
          `}
        >
          {team.rank}
        </div>

        {/* Crown for leader */}
        {isLeader && (
          <span className="text-2xl lg:text-3xl animate-crown-pulse flex-shrink-0">
            👑
          </span>
        )}

        {/* Team name */}
        <div
          className={`
            flex-1 font-semibold truncate
            ${
              isLeader
                ? "text-green-200 text-xl lg:text-2xl 2xl:text-3xl"
                : isSecond || isThird
                  ? "text-zinc-200 text-lg lg:text-xl 2xl:text-2xl"
                  : "text-zinc-300 text-base lg:text-lg 2xl:text-xl"
            }
          `}
        >
          {team.team_name}
        </div>

        {/* Points */}
        <div
          className={`
            flex-shrink-0 font-mono font-bold tabular-nums
            ${
              isLeader
                ? "text-green-300 text-2xl lg:text-3xl 2xl:text-4xl"
                : isSecond || isThird
                  ? "text-zinc-200 text-xl lg:text-2xl 2xl:text-3xl"
                  : "text-zinc-400 text-lg lg:text-xl 2xl:text-2xl"
            }
          `}
        >
          <AnimatedNumber value={team.total_points} />
        </div>

        {/* Points label */}
        <span className="text-zinc-600 text-xs lg:text-sm flex-shrink-0">
          pts
        </span>
      </div>
    </div>
  );
}
