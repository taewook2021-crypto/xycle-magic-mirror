import { useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import { useDashboardData } from "@/hooks/useDashboardData";
import { usePeerAvgProgress } from "@/hooks/usePeerAvgProgress";
import DashboardHeader, { getDDay } from "@/components/dashboard/DashboardHeader";
import SubjectProgressCard from "@/components/dashboard/SubjectProgressCard";
import AddSubjectSheet from "@/components/dashboard/AddSubjectSheet";
import { BookOpen, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";


export default function Dashboard() {
  const { subjectProgress, bookProgress, userBooks, allBooks, todayAttempts, loading, addBook, removeBook, reorderBooks } =
    useDashboardData();

  const { peerAvgMap, examStatus } = usePeerAvgProgress();

  const [activeTab, setActiveTab] = useState<"subjects" | "addBook">("subjects");
  const [showAddSheet, setShowAddSheet] = useState(false);

  const dDay = getDDay();
  const userBookIds = new Set(userBooks.map((b) => b.bookId));
  const subjectMap = new Map(subjectProgress.map((s) => [s.id, s.name]));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // All sortable IDs for DndContext
  const sortableIds = useMemo(() => userBooks.map((b) => b.id), [userBooks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = userBooks.findIndex((b) => b.id === active.id);
    const newIndex = userBooks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Check they're in the same subject
    if (userBooks[oldIndex].subjectId !== userBooks[newIndex].subjectId) return;

    const reordered = [...userBooks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    reorderBooks(reordered);
  };

  return (
    <AppShell>
      <DashboardHeader dDay={dDay} todayAttempts={todayAttempts} />

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
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
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
                        onDeleteBook={removeBook}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (() => {
              const availableBooks = allBooks.filter((b) => !userBookIds.has(b.id));
              const grouped = new Map<string, { subjectName: string; books: typeof availableBooks }>();
              for (const book of availableBooks) {
                const subjectName = subjectMap.get(book.subjectId) || "기타";
                if (!grouped.has(book.subjectId)) {
                  grouped.set(book.subjectId, { subjectName, books: [] });
                }
                grouped.get(book.subjectId)!.books.push(book);
              }

              if (availableBooks.length === 0) {
                return (
                  <p className="text-center py-8 text-sm text-muted-foreground">
                    추가할 수 있는 교재가 없습니다
                  </p>
                );
              }

              return (
                <div className="space-y-5">
                  {Array.from(grouped.values()).map(({ subjectName, books: groupBooks }) => (
                    <div key={subjectName}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                        {subjectName}
                      </p>
                      <div className="space-y-2">
                        {groupBooks.map((book) => (
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
                              {book.author && (
                                <p className="text-[11px] text-muted-foreground">{book.author}</p>
                              )}
                            </div>
                            <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>

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
