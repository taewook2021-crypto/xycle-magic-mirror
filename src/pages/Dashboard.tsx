import AppShell from "@/components/layout/AppShell";
import DashboardHeader, { getDDay } from "@/components/dashboard/DashboardHeader";
import SubjectProgressCard from "@/components/dashboard/SubjectProgressCard";
import ActivityStream from "@/components/dashboard/ActivityStream";
import LiveFeed from "@/components/dashboard/LiveFeed";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Plus, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { subjectProgress, bookProgress, userBooks, allBooks, totalAttempts, loading, addBook } =
    useDashboardData();
  const { activities, liveFeedBooks, isMePublic } = useSocialFeed();

  const userBookIds = new Set(userBooks.map((b) => b.bookId));

  return (
    <AppShell>
      <DashboardHeader dDay={getDDay()} totalAttempts={totalAttempts} />

      <Tabs defaultValue="subjects" className="px-4 pt-3 pb-8">
        <TabsList className="w-full">
          <TabsTrigger value="subjects" className="flex-1">과목</TabsTrigger>
          <TabsTrigger value="addbooks" className="flex-1">교재추가</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-3 space-y-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
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
                colorIndex={i}
                userBooks={userBooks}
                bookProgress={bookProgress}
              />
            ))
          )}

          {/* Social activity stream */}
          {activities.length > 0 && (
            <div className="pt-2">
              <ActivityStream activities={activities} />
            </div>
          )}

          {/* Live feed - per-book comparison */}
          {liveFeedBooks.length > 0 && (
            <div className="pt-1">
              <LiveFeed books={liveFeedBooks} isMePublic={isMePublic} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="addbooks" className="mt-3 space-y-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))
          ) : allBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              등록 가능한 교재가 없습니다
            </div>
          ) : (
            (() => {
              const subjectMap = new Map(subjectProgress.map((s) => [s.id, s.name]));
              const grouped = new Map<string, typeof allBooks>();
              allBooks.forEach((b) => {
                if (!grouped.has(b.subjectId)) grouped.set(b.subjectId, []);
                grouped.get(b.subjectId)!.push(b);
              });

              return Array.from(grouped.entries()).map(([subjectId, books]) => (
                <div key={subjectId} className="space-y-1">
                  <p className="text-[11px] font-medium text-muted-foreground px-1 pt-2">
                    {subjectMap.get(subjectId) || "기타"}
                  </p>
                  {books.map((book) => {
                    const registered = userBookIds.has(book.id);
                    return (
                      <button
                        key={book.id}
                        onClick={() => !registered && addBook(book.id)}
                        disabled={registered}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-accent/40 transition-colors disabled:opacity-70 disabled:cursor-default"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {registered ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                          {book.author && (
                            <p className="text-[11px] text-muted-foreground">{book.author}</p>
                          )}
                        </div>
                        {!registered && (
                          <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ));
            })()
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
