export default function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 lg:gap-5 rounded-xl px-4 lg:px-6 py-3 border border-green-500/5 bg-green-950/10 backdrop-blur-sm animate-skeleton-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {/* Rank badge */}
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-green-500/5 flex-shrink-0" />
          {/* Logo circle */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-500/5 flex-shrink-0" />
          {/* Team name */}
          <div className="flex-1 h-5 rounded-md bg-green-500/5" />
          {/* Points */}
          <div className="w-20 h-7 rounded-md bg-green-500/5 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
