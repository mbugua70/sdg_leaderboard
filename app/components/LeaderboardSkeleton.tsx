export default function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 rounded-xl px-8 py-4 border border-green-500/5 bg-green-950/10 backdrop-blur-sm animate-skeleton-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="w-14 h-14 rounded-lg bg-green-500/5" />
          <div className="flex-1 h-6 rounded bg-green-500/5" />
          <div className="w-24 h-8 rounded bg-green-500/5" />
        </div>
      ))}
    </div>
  );
}
