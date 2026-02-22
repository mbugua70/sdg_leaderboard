"use client";

import { useState, useCallback } from "react";
import type { TeamData } from "@/app/types/leaderboard";
import AnimatedNumber from "./AnimatedNumber";

interface LeaderboardRowProps {
  team: TeamData;
  index: number;
}

function TeamLogo({
  logoUrl,
  teamName,
  isLeader,
  isSecond,
  isThird,
}: {
  logoUrl?: string;
  teamName: string;
  isLeader: boolean;
  isSecond: boolean;
  isThird: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  const sizeClass = isLeader
    ? "w-12 h-12 lg:w-14 lg:h-14"
    : "w-10 h-10 lg:w-12 lg:h-12";

  const ringClass = isLeader
    ? "ring-2 ring-green-400 shadow-[0_0_20px_rgba(74,222,128,0.7),0_0_8px_rgba(74,222,128,0.4)]"
    : isSecond
      ? "ring-2 ring-blue-400/70 shadow-[0_0_12px_rgba(96,165,250,0.35)]"
      : isThird
        ? "ring-2 ring-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.35)]"
        : "ring-1 ring-white/10";

  const fallbackBg = isLeader
    ? "bg-gradient-to-br from-green-700/60 to-green-900/60 text-green-200"
    : isSecond
      ? "bg-gradient-to-br from-blue-700/40 to-blue-900/40 text-blue-200"
      : isThird
        ? "bg-gradient-to-br from-amber-700/40 to-amber-900/40 text-amber-200"
        : "bg-gradient-to-br from-zinc-700/30 to-zinc-900/30 text-zinc-400";

  const initial = teamName.charAt(0).toUpperCase();
  const textSize = isLeader
    ? "text-lg lg:text-xl font-bold"
    : "text-sm lg:text-base font-semibold";

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClass} rounded-full overflow-hidden ring-offset-1 ring-offset-black/50 ${ringClass} transition-shadow duration-500`}
      >
        {logoUrl && !imgError ? (
          <img
            src={logoUrl}
            alt={teamName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${fallbackBg} ${textSize}`}
          >
            {initial}
          </div>
        )}
      </div>

      {isLeader && (
        <span
          className="absolute -top-2 -right-1.5 text-sm lg:text-base animate-crown-pulse select-none pointer-events-none"
          aria-hidden="true"
        >
          👑
        </span>
      )}
    </div>
  );
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

  return (
    <div className="flex-1 min-h-0 px-2 lg:px-4 py-0.5">
      <div
        className={`
          h-full flex items-center gap-3 lg:gap-5 rounded-xl px-4 lg:px-6
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
        {/* Rank badge */}
        <div
          className={`
            flex-shrink-0 flex items-center justify-center rounded-lg font-bold
            w-9 h-9 lg:w-11 lg:h-11 text-base lg:text-xl
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

        {/* Team logo */}
        <TeamLogo
          logoUrl={team.log_url}
          teamName={team.team_name}
          isLeader={isLeader}
          isSecond={isSecond}
          isThird={isThird}
        />

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
