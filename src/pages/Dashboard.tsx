import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { usePeerAvgProgress } from "@/hooks/usePeerAvgProgress";
import DashboardHeader, { getDDay } from "@/components/dashboard/DashboardHeader";
import TodayStatsCard from "@/components/dashboard/TodayStatsCard";
import SubjectProgressCard from "@/components/dashboard/SubjectProgressCard";
import LiveFeed from "@/components/dashboard/LiveFeed";
import AddSubjectSheet from "@/components/dashboard/AddSubjectSheet";
import { BookOpen, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { subjectProgress, bookProgress, userBooks, allBooks, totalAttempts, loading, addBook } =
    useDashboardData();
  const { liveFeedBooks } = useSocialFeed();
  const { peerAvgMap, examStatus } = usePeerAvgProgress();

  const [activeTab, setActiveTab] = useState<"subjects" | "addBook">("subjects");
  const [showAddSheet, setShowAddSheet] = useState(false);

  const dDay = getDDay();
  const userBookIds = new Set(userBooks.map((b) => b.bookId));
  const subjectMap = new Map(subjectProgress.map((s) => [s.id, s.name]));

  return (
    <AppShell>
      {/* Header */}
      <DashboardHeader dDay={dDay} totalAttempts={totalAttempts} />

      <div className="px-4 sm:px-6 pt-5 pb-12 max-w-2xl mx-auto space-y-5">
        {/* Tabs */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setActiveTab("subjects")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "subjects"
                ? "bg-card text-foreground"
                : "bg-muted/40 text-muted-foreground"
            }`}
          >
            과목
          </button>
          <button
            onClick={() => setActiveTab("addBook")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "addBook"
                ? "bg-card text-foreground"
                : "bg-muted/40 text-muted-foreground"
            }`}
          >
            교재추가
          </button>
        </div>

        {activeTab === "subjects" ? (
          <>
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
                    peerAvgMap={peerAvgMap}
                    examStatus={examStatus}
                  />
                ))}
              </div>
            )}

            {/* Live feed */}
            {!loading && liveFeedBooks.length > 0 && (
              <LiveFeed books={liveFeedBooks} />
            )}
          </>
        ) : (
          <>
            {/* Add book list */}
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {allBooks
                  .filter((b) => !userBookIds.has(b.id))
                  .map((book) => (
                    <button
                      key={book.id}
                      onClick={() => addBook(book.id)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-border bg-card text-left hover:bg-accent/40 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {subjectMap.get(book.subjectId) || "기타"}
                          {book.author && ` · ${book.author}`}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                {allBooks.filter((b) => !userBookIds.has(b.id)).length === 0 && (
                  <p className="text-center py-8 text-sm text-muted-foreground">
                    추가할 수 있는 교재가 없습니다
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add subject sheet */}
      <AddSubjectSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        onAdd={(name, color) => {
          console.log("Add subject:", name, color);
        }}
      />
    </AppShell>
  );
}
