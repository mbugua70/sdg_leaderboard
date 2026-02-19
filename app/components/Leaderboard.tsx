"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { useLeaderboard } from "@/app/hooks/useLeaderboard";
import LeaderboardRow from "./LeaderboardRow";
import LeaderboardSkeleton from "./LeaderboardSkeleton";

const SDG_COLORS = [
  "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21",
  "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367",
  "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B",
  "#00689D", "#19486A",
];

const MIN_ROW_HEIGHT = 50;
const HOLD_TOP_MS    = 4000;
const HOLD_BOTTOM_MS = 3000;
const TRANSITION_MS  = 1200;

export default function Leaderboard() {
  const { teams, isLoading, error } = useLeaderboard();

  const rowsAreaRef = useRef<HTMLDivElement>(null);
  const [availHeight, setAvailHeight] = useState(0);
  const [viewStart, setViewStart]     = useState(0);

  // Measure the rows area. We need this only to detect whether scroll is
  // required (when ideal row height would drop below MIN_ROW_HEIGHT).
  // Layout itself is flex-based (no pixel dependence), so a slightly stale
  // reading only affects the scroll trigger, not visibility of any row.
  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const el = rowsAreaRef.current;
      if (el) setAvailHeight(el.offsetHeight);
    };

    measure();
    document.fonts.ready.then(measure);

    const ro = new ResizeObserver(measure);
    if (rowsAreaRef.current) ro.observe(rowsAreaRef.current);
    window.addEventListener("resize", measure);

    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Also re-measure once the loading skeleton is replaced by actual rows
  useEffect(() => {
    const el = rowsAreaRef.current;
    if (!isLoading && el) setAvailHeight(el.offsetHeight);
  }, [isLoading]);

  // ── Scroll-need detection ───────────────────────────────────────────
  // Only scroll when each row would be smaller than MIN_ROW_HEIGHT.
  // When undecided (availHeight not yet measured), assume all teams fit.
  const idealRowHeight = availHeight > 0 && teams.length > 0
    ? availHeight / teams.length
    : MIN_ROW_HEIGHT;

  const visibleCount = availHeight > 0 && teams.length > 0
    ? idealRowHeight >= MIN_ROW_HEIGHT
      ? teams.length
      : Math.floor(availHeight / MIN_ROW_HEIGHT)
    : teams.length;

  const needsScroll  = teams.length > visibleCount;
  const maxViewStart = Math.max(0, teams.length - visibleCount);

  // ── Scroll cycle ───────────────────────────────────────────────────
  useEffect(() => {
    if (!needsScroll) { setViewStart(0); return; }

    let goingDown = false;
    let t: ReturnType<typeof setTimeout>;

    const step = () => {
      goingDown = !goingDown;
      setViewStart(goingDown ? maxViewStart : 0);
      t = setTimeout(step, TRANSITION_MS + (goingDown ? HOLD_BOTTOM_MS : HOLD_TOP_MS));
    };

    t = setTimeout(step, HOLD_TOP_MS);
    return () => clearTimeout(t);
  }, [needsScroll, maxViewStart]);

  const atTop    = viewStart === 0;
  const atBottom = viewStart >= maxViewStart;

  // ── Percentage-based sled geometry ────────────────────────────────
  // Sled is a flex column. When all teams fit: height = 100% of container,
  // every row gets an equal share via flex-1 — no pixel math needed, no
  // overflow-hidden clipping can cut off the last row.
  //
  // When scroll is needed: sled height = (N / visibleCount) * 100% so each
  // row still equals (1 / visibleCount) of the container height. TranslateY
  // is expressed as a % of the sled's own height so it shifts by exactly
  // one row-height per viewStart unit — still no pixels required.
  //
  //   translateY% = -(viewStart / N) * 100%  (% of sled)
  //               = -(viewStart / N) * (N / V) * C
  //               = -(viewStart / V) * C   ← exactly viewStart row-heights ✓
  const sledHeightPct = needsScroll && visibleCount > 0
    ? `${(teams.length / visibleCount) * 100}%`
    : "100%";

  const translateYPct = needsScroll && teams.length > 0
    ? `${-(viewStart / teams.length) * 100}%`
    : "0%";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 flex-1 min-h-0 flex flex-col">

      {/* ── Fixed header ──────────────────────────────────────────── */}
      <div className="shrink-0">
        <div className="flex w-full h-1.5 rounded-full overflow-hidden mb-3 lg:mb-4">
          {SDG_COLORS.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        <div className="text-center mb-4 lg:mb-5">
          <h1 className="text-3xl lg:text-5xl 2xl:text-6xl font-bold tracking-tight">
            <span className="text-white">Safaricom </span>
            <span style={{ color: "#4CB848" }}>SDG Challenge</span>
          </h1>
          <p className="text-zinc-400 mt-1.5 text-sm lg:text-base font-medium">
            Race to 2030 — Accelerating a Digital Future
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-red-950/50 border border-red-800/50 px-4 py-3 text-red-300 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* ── Rows viewport ─────────────────────────────────────────── */}
      <div ref={rowsAreaRef} className="flex-1 min-h-0 relative overflow-hidden">
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : (
          <>
            {/* Flex-column sled — rows share height via flex-1, no pixel math */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: sledHeightPct,
                transform: `translateY(${translateYPct})`,
                transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                willChange: "transform",
              }}
            >
              {teams.map((team, i) => (
                <LeaderboardRow key={team.team_name} team={team} index={i} />
              ))}
            </div>

            {/* Top fade */}
            <div
              className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10"
              style={{
                opacity: atTop ? 0 : 1,
                transition: "opacity 0.9s ease",
                background: "linear-gradient(to bottom, #0d3318 0%, transparent 100%)",
              }}
            />

            {/* Bottom fade */}
            <div
              className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10"
              style={{
                opacity: atBottom ? 0 : 1,
                transition: "opacity 0.9s ease",
                background: "linear-gradient(to top, #0d3318 0%, transparent 100%)",
              }}
            />
          </>
        )}
      </div>

      {/* ── Scroll indicator — always in DOM to avoid layout reflow ── */}
      <div
        className="shrink-0 flex items-center justify-center gap-3 pt-2"
        style={{
          opacity: needsScroll && !isLoading ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="rounded-full" style={{
            height: "6px",
            width: atTop ? "18px" : "6px",
            background: atTop ? "#4CB848" : "rgba(255,255,255,0.2)",
            transition: "width 0.4s ease, background 0.4s ease",
          }} />
          <div className="rounded-full" style={{
            height: "6px",
            width: atBottom ? "18px" : "6px",
            background: atBottom ? "#4CB848" : "rgba(255,255,255,0.2)",
            transition: "width 0.4s ease, background 0.4s ease",
          }} />
        </div>
        <span className="text-zinc-500 text-xs tabular-nums font-light tracking-wide">
          {viewStart + 1}–{Math.min(viewStart + visibleCount, teams.length)} of {teams.length}
        </span>
      </div>

    </div>
  );
}
