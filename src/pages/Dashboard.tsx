import AppShell from "@/components/layout/AppShell";
import PeerComparisonCard from "@/components/dashboard/PeerComparisonCard";
import TodayStatsCard from "@/components/dashboard/TodayStatsCard";
import LiveFeed from "@/components/dashboard/LiveFeed";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "수험생";

  return (
    <AppShell>
      <div className="px-4 pt-5 space-y-4">
        {/* Header */}
        <div>
          <p className="text-xs text-muted-foreground">안녕하세요,</p>
          <h1 className="text-lg font-bold text-foreground">{displayName}님</h1>
        </div>

        {/* Peer comparison hero */}
        <PeerComparisonCard />

        {/* Today stats */}
        <TodayStatsCard />

        {/* Live feed */}
        <LiveFeed />
      </div>
    </AppShell>
  );
}
