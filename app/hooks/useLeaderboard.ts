"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { RawTeamData, TeamData } from "@/app/types/leaderboard";

export function useLeaderboard() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previousTeamsRef = useRef<Map<string, number>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("API error");

      const raw: RawTeamData[] = await response.json();

      const sorted = raw
        .map((t) => ({
          team_name: t.team_name,
          total_points: Number(t.total_points) || 0,
        }))
        .sort((a, b) => b.total_points - a.total_points);

      const prevMap = previousTeamsRef.current;

      const ranked: TeamData[] = sorted.map((t, i) => {
        const prev = prevMap.get(t.team_name);
        return {
          team_name: t.team_name,
          total_points: t.total_points,
          rank: i + 1,
          previousPoints: prev ?? null,
          pointsChanged: prev !== undefined && prev !== t.total_points,
        };
      });

      // Build serialization key to skip no-op updates
      const newKey = ranked.map((t) => `${t.team_name}:${t.total_points}`).join("|");

      setTeams((prev) => {
        const oldKey = prev.map((t) => `${t.team_name}:${t.total_points}`).join("|");
        if (oldKey === newKey && prev.length > 0) return prev;
        return ranked;
      });

      // Update previous map
      const nextMap = new Map<string, number>();
      for (const t of sorted) {
        nextMap.set(t.team_name, t.total_points);
      }
      previousTeamsRef.current = nextMap;

      retryCountRef.current = 0;
      setError(null);
      setIsLoading(false);
    } catch {
      retryCountRef.current += 1;
      if (retryCountRef.current >= 3) {
        setError("Unable to reach leaderboard. Retrying...");
      }
      // Keep existing data visible on transient failures
      if (teams.length === 0) {
        setIsLoading(true);
      }
    }
  }, [teams.length]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return { teams, isLoading, error };
}
