import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PeerComparisonCard from "@/components/dashboard/PeerComparisonCard";
import TodayStatsCard from "@/components/dashboard/TodayStatsCard";
import LiveFeed, { type BookFeedItem } from "@/components/dashboard/LiveFeed";
import ActivityStream, { type ActivityItem, type PeerAvgProgress } from "@/components/dashboard/ActivityStream";
import DashboardHero from "@/components/dashboard/DashboardHero";
import ReferralBanner from "@/components/dashboard/ReferralBanner";
import LockedInsight from "@/components/dashboard/LockedInsight";
import NicknameSetup from "@/components/NicknameSetup";
import { useAuth } from "@/hooks/useAuth";
import { useReferral } from "@/hooks/useReferral";
import { Switch } from "@/components/ui/switch";
import { type ChapterData } from "@/components/review/ReviewGrid";

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

const mockActivities: ActivityItem[] = [
  { id: "a1", userName: "김O현", bookTitle: "세법개론", chapterTitle: "Ch.3 부가가치세", minutesAgo: 2, isLive: true },
  { id: "a2", userName: "박O수", bookTitle: "중급회계 연습서", chapterTitle: "Ch.7 유형자산", minutesAgo: 5, isLive: true },
  { id: "a3", userName: "최O영", bookTitle: "원가관리회계", chapterTitle: "Ch.2 개별원가", minutesAgo: 8, isLive: true },
  { id: "a4", userName: "이O준", bookTitle: "세법개론", chapterTitle: "Ch.5 소득세", questionCount: 15, minutesAgo: 12, isLive: false },
  { id: "a5", userName: "정O민", bookTitle: "중급회계 연습서", chapterTitle: "Ch.4 금융자산", questionCount: 22, minutesAgo: 18, isLive: false },
  { id: "a6", userName: "한O서", bookTitle: "재무관리", chapterTitle: "Ch.1 화폐의 시간가치", questionCount: 8, minutesAgo: 25, isLive: false },
  { id: "a7", userName: "김O현", bookTitle: "원가관리회계", chapterTitle: "Ch.6 표준원가", questionCount: 30, minutesAgo: 45, isLive: false },
];

const mockPeerAvgProgress: PeerAvgProgress[] = [
  { bookTitle: "중급회계 연습서", avgChapter: 5, totalChapters: 12, avgChapterTitle: "Ch.5 유가증권" },
  { bookTitle: "세법개론", avgChapter: 3, totalChapters: 10, avgChapterTitle: "Ch.3 부가가치세" },
  { bookTitle: "원가관리회계", avgChapter: 4, totalChapters: 8, avgChapterTitle: "Ch.4 종합원가" },
  { bookTitle: "재무관리", avgChapter: 2, totalChapters: 9, avgChapterTitle: "Ch.2 자본예산" },
];

const makeMockChapters = (): ChapterData[] => [
  {
    chapterId: "c1",
    chapterTitle: "Ch.1 재무보고와 국제회계기준",
    questions: Array.from({ length: 8 }, (_, i) => {
      const results = ["correct", "wrong", "half", null] as ("correct" | "wrong" | "half" | null)[];
      const results2 = ["correct", "wrong", null] as ("correct" | "wrong" | null)[];
      return {
        questionNumber: i + 1,
        rounds: [
          { result: results[Math.floor(Math.random() * 4)], date: "3/12" },
          { result: results2[Math.floor(Math.random() * 3)], date: "3/14" },
          { result: null },
        ],
      };
    }),
  },
  {
    chapterId: "c2",
    chapterTitle: "Ch.2 재무제표",
    questions: Array.from({ length: 10 }, (_, i) => {
      const results = ["correct", "wrong", "half"] as ("correct" | "wrong" | "half")[];
      return {
        questionNumber: i + 1,
        rounds: [
          { result: results[Math.floor(Math.random() * 3)], date: "3/10" },
          { result: null },
          { result: null },
        ],
      };
    }),
  },
];

const mockBooks: BookFeedItem[] = [
  {
    bookTitle: "중급회계 연습서",
    myCount: 18,
    avgCount: 12,
    peers: [
      { id: "1", name: "김O현", count: 22, isPublic: true, streak: 15, weeklyCount: 140 },
      { id: "2", name: "나", count: 18, isMe: true, isPublic: true },
      { id: "3", name: "박O수", count: 15, isPublic: true, streak: 8, weeklyCount: 95 },
      { id: "4", name: "이O준", count: 8, isPublic: false, streak: 3, weeklyCount: 42 },
    ],
  },
  {
    bookTitle: "세법개론",
    myCount: 14,
    avgCount: 16,
    peers: [
      { id: "5", name: "최O영", count: 25, isPublic: true, streak: 22, weeklyCount: 180 },
      { id: "6", name: "박O수", count: 18, isPublic: true, streak: 8, weeklyCount: 95 },
      { id: "7", name: "나", count: 14, isMe: true, isPublic: true },
      { id: "8", name: "김O현", count: 10, isPublic: true, streak: 15, weeklyCount: 140 },
    ],
  },
];

export default function Dashboard() {
  const { user, profile, setProfile } = useAuth();
  const [isMePublic, setIsMePublic] = useState(true);
  const referral = useReferral();

  const needsNickname = user && profile && !profile.display_name;

  const handleGoPublic = () => setIsMePublic(true);

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

        {/* Public toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
          <div>
            <p className="text-xs font-medium text-foreground">내 학습 공개</p>
            <p className="text-[10px] text-muted-foreground">공개하면 다른 수험생의 회독표를 열람할 수 있어요</p>
          </div>
          <Switch checked={isMePublic} onCheckedChange={setIsMePublic} />
        </div>

        <ActivityStream activities={mockActivities} peerAvgProgress={mockPeerAvgProgress} />
        <TodayStatsCard stats={mockStats} />
        <PeerComparisonCard weekData={mockWeekData} />
        <LiveFeed books={mockBooks} isMePublic={isMePublic} onGoPublic={handleGoPublic} />
      </div>
    </AppShell>
  );
}
