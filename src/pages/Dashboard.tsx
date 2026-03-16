import AppShell from "@/components/layout/AppShell";
import PeerComparisonCard from "@/components/dashboard/PeerComparisonCard";
import TodayStatsCard from "@/components/dashboard/TodayStatsCard";
import LiveFeed, { BookFeedItem } from "@/components/dashboard/LiveFeed";
import DashboardHero from "@/components/dashboard/DashboardHero";
import NicknameSetup from "@/components/NicknameSetup";
import { useAuth } from "@/hooks/useAuth";

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

const mockBooks: BookFeedItem[] = [
  {
    bookTitle: "중급회계 연습서",
    myCount: 18,
    avgCount: 12,
    peers: [
      { id: "1", name: "김O현", count: 22, isPublic: true },
      { id: "2", name: "나", count: 18, isMe: true, isPublic: true },
      { id: "3", name: "박O수", count: 15, isPublic: true },
      { id: "4", name: "이O준", count: 8, isPublic: false },
    ],
  },
  {
    bookTitle: "세법개론",
    myCount: 14,
    avgCount: 16,
    peers: [
      { id: "5", name: "최O영", count: 25, isPublic: true },
      { id: "6", name: "박O수", count: 18, isPublic: true },
      { id: "7", name: "나", count: 14, isMe: true, isPublic: true },
      { id: "8", name: "김O현", count: 10, isPublic: true },
    ],
  },
];

export default function Dashboard() {
  const { user, profile, setProfile } = useAuth();

  const needsNickname = user && profile && !profile.display_name;

  return (
    <AppShell>
      {needsNickname && (
        <NicknameSetup
          userId={user.id}
          onComplete={(name) => setProfile({ ...profile!, display_name: name })}
        />
      )}
      <div className="px-4 pt-5 pb-8 space-y-4">
        <DashboardHero {...mockHero} />
        <TodayStatsCard stats={mockStats} />
        <PeerComparisonCard weekData={mockWeekData} />
        <LiveFeed books={mockBooks} />
      </div>
    </AppShell>
  );
}
