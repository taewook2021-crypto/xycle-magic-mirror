import AppShell from "@/components/layout/AppShell";
import DashboardHeader, { getDDay } from "@/components/dashboard/DashboardHeader";
import SubjectProgressCard from "@/components/dashboard/SubjectProgressCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ResultBadge({ result }: { result: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    correct: { label: "O", cls: "text-emerald-600" },
    half: { label: "△", cls: "text-amber-500" },
    wrong: { label: "X", cls: "text-destructive" },
  };
  const r = map[result] || map.wrong;
  return <span className={`text-sm font-bold ${r.cls}`}>{r.label}</span>;
}

export default function Dashboard() {
  const { subjectProgress, recentAttempts, userBooks, allBooks, totalAttempts, loading, addBook } =
    useDashboardData();

  return (
    <AppShell>
      <DashboardHeader dDay={getDDay()} totalAttempts={totalAttempts} />

      <Tabs defaultValue="subjects" className="px-4 pt-3 pb-8">
        <TabsList className="w-full">
          <TabsTrigger value="subjects" className="flex-1">과목</TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">최근활동</TabsTrigger>
        </TabsList>

        {/* 과목별 진도 */}
        <TabsContent value="subjects" className="mt-3 space-y-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          ) : subjectProgress.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              등록된 과목이 없습니다
            </div>
          ) : (
            subjectProgress.map((sp, i) => (
              <SubjectProgressCard
                key={sp.id}
                subjectId={sp.id}
                name={sp.name}
                attempted={sp.attempted}
                total={sp.totalQuestions}
                correctRate={
                  sp.attempted > 0
                    ? Math.round((sp.correct / sp.attempted) * 100)
                    : 0
                }
                colorIndex={i}
                userBooks={userBooks}
                availableBooks={allBooks}
                onAddBook={addBook}
              />
            ))
          )}
        </TabsContent>

        {/* 최근 활동 */}
        <TabsContent value="recent" className="mt-3 space-y-1">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))
          ) : recentAttempts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              풀이 기록이 없습니다
            </div>
          ) : (
            recentAttempts.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/40 transition-colors"
              >
                <ResultBadge result={a.result} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {a.bookTitle} · {a.chapterTitle}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.questionNumber}번
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(a.attemptedAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
