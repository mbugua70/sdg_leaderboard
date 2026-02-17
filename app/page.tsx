import Leaderboard from "@/app/components/Leaderboard";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-start justify-center pt-12 lg:pt-20 relative"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(76, 184, 72, 0.3) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
          linear-gradient(to bottom, #145a28 0%, #0d3318 30%, #0a2a14 70%, #0d3318 100%)
        `,
      }}
    >
      <Leaderboard />
    </div>
  );
}
