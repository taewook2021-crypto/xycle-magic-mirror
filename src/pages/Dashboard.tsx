import AppShell from "@/components/layout/AppShell";
import PeerComparisonCard from "@/components/dashboard/PeerComparisonCard";
import TodayStatsCard from "@/components/dashboard/TodayStatsCard";
import LiveFeed from "@/components/dashboard/LiveFeed";
import DashboardHero from "@/components/dashboard/DashboardHero";

const mockHero = {
  displayName: "수험생",
  todaySolved: 32,
  streak: 12,
  avgDiff: 14,
};

const mockStats = {
  todaySolved: 32,
  weeklySolved: 207,
  streak: 12,
  accuracyTrend: 14,
};

const mockWeekData = [
  { day: "월", me: 28, avg: 22 },
  { day: "화", me: 35, avg: 20 },
  { day: "수", me: 18, avg: 24 },
  { day: "목", me: 32, avg: 19 },
  { day: "금", me: 40, avg: 25 },
  { day: "토", me: 22, avg: 18 },
  { day: "일", me: 32, avg: 18 },
];

const mockFeed = [
  { id: "1", name: "김O현", count: 45, emoji: "🏃", isMe: false },
  { id: "2", name: "박O수", count: 38, emoji: "📖", isMe: false },
  { id: "3", name: "나", count: 32, emoji: "🔥", isMe: true },
  { id: "4", name: "이O준", count: 28, emoji: "✏️", isMe: false },
  { id: "5", name: "최O영", count: 21, emoji: "📚", isMe: false },
];

export default function Dashboard() {
  return (
    <AppShell>
      <div className="px-4 pt-5 pb-8 space-y-4">
        <DashboardHero {...mockHero} />
        <TodayStatsCard stats={mockStats} />
        <PeerComparisonCard weekData={mockWeekData} />
        <LiveFeed items={mockFeed} />
      </div>
    </AppShell>
  );
}
