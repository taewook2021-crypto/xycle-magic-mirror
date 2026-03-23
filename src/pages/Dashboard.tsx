import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import DashboardHeader, { getDDay } from "@/components/dashboard/DashboardHeader";
import TodayStatsCard from "@/components/dashboard/TodayStatsCard";
import SubjectProgressCard from "@/components/dashboard/SubjectProgressCard";
import LiveFeed from "@/components/dashboard/LiveFeed";
import AddSubjectSheet from "@/components/dashboard/AddSubjectSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { subjectProgress, bookProgress, userBooks, totalAttempts, loading } =
    useDashboardData();
  const { liveFeedBooks } = useSocialFeed();

  const [showAddSheet, setShowAddSheet] = useState(false);

  const dDay = getDDay();

  return (
    <AppShell>
      {/* Header */}
      <DashboardHeader dDay={dDay} totalAttempts={totalAttempts} />

      <div className="px-4 sm:px-6 pt-5 pb-12 max-w-2xl mx-auto space-y-5">
        {/* Today stats */}
        <TodayStatsCard />

        {/* Subject progress cards */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {subjectProgress.map((subject, index) => (
              <SubjectProgressCard
                key={subject.id}
                subjectId={subject.id}
                name={subject.name}
                colorIndex={index}
                userBooks={userBooks}
                bookProgress={bookProgress}
              />
            ))}
          </div>
        )}

        {/* Add subject button */}
        {!loading && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAddSheet(true)}
          >
            <Plus className="h-4 w-4" />
            과목 추가
          </Button>
        )}

        {/* Live feed */}
        {!loading && liveFeedBooks.length > 0 && (
          <LiveFeed books={liveFeedBooks} />
        )}
      </div>

      {/* Add subject sheet */}
      <AddSubjectSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        onAdd={(name, color) => {
          // Subject addition handled via Supabase
          console.log("Add subject:", name, color);
        }}
      />
    </AppShell>
  );
}
