import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { Search, BookOpen, Check, Plus, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { getSubjectColor } from "@/components/dashboard/SubjectProgressCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { subjectProgress, bookProgress, userBooks, allBooks, totalAttempts, loading, addBook } =
    useDashboardData();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const userBookIds = new Set(userBooks.map((b) => b.bookId));
  const bpMap = new Map(bookProgress.map((bp) => [bp.bookId, bp]));
  const subjectMap = new Map(subjectProgress.map((s, i) => [s.id, { name: s.name, colorIndex: i }]));

  const filters = useMemo(() => {
    const items = [{ id: "all", label: "전체" }];
    subjectProgress.forEach((s) => items.push({ id: s.id, label: s.name }));
    return items;
  }, [subjectProgress]);

  // Merge user books with progress data, filtered
  const displayBooks = useMemo(() => {
    let books = userBooks.map((ub) => {
      const bp = bpMap.get(ub.bookId);
      const subj = subjectMap.get(ub.subjectId);
      return {
        ...ub,
        totalQuestions: bp?.totalQuestions || 0,
        attempted: bp?.attempted || 0,
        correct: bp?.correct || 0,
        subjectName: subj?.name || "기타",
        colorIndex: subj?.colorIndex || 0,
      };
    });

    if (activeFilter !== "all") {
      books = books.filter((b) => b.subjectId === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subjectName.toLowerCase().includes(q) ||
          (b.author && b.author.toLowerCase().includes(q))
      );
    }

    return books;
  }, [userBooks, activeFilter, searchQuery, bpMap, subjectMap]);

  return (
    <AppShell>
      <div className="px-4 sm:px-8 pt-8 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          내 교재
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          등록한 교재들의 학습 현황을 확인하세요.
        </p>

        {/* Search + Stats row */}
        <div className="flex items-center gap-3 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="교재 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-border/60 bg-white text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-border transition-colors"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeFilter === f.id
                  ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                  : "bg-transparent text-foreground border-border hover:bg-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Book card grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          ) : displayBooks.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {searchQuery ? "검색 결과가 없습니다" : "등록된 교재가 없습니다"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayBooks.map((book) => {
                const progress =
                  book.totalQuestions > 0
                    ? Math.round((book.attempted / book.totalQuestions) * 100)
                    : 0;
                const correctRate =
                  book.attempted > 0
                    ? Math.round((book.correct / book.attempted) * 100)
                    : 0;
                const color = getSubjectColor(book.colorIndex);

                return (
                  <button
                    key={book.id}
                    onClick={() => navigate(`/review/${book.bookId}`)}
                    className="group text-left rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    {/* Thumbnail area */}
                    <div
                      className="h-32 sm:h-36 flex items-end p-4 relative"
                      style={{
                        background: `linear-gradient(135deg, hsl(${color} / 0.15) 0%, hsl(${color} / 0.05) 100%)`,
                      }}
                    >
                      <div
                        className="absolute top-3 right-3 w-2 h-2 rounded-full"
                        style={{ backgroundColor: `hsl(${color})` }}
                      />
                      <div className="space-y-1 w-full">
                        <p className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </p>
                        {book.author && (
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        )}
                      </div>
                    </div>

                    {/* Info area */}
                    <div className="px-4 py-3 space-y-2.5">
                      <Progress
                        value={progress}
                        className="h-1.5"
                        style={{ ["--progress-color" as string]: `hsl(${color})` }}
                      />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                        <span>
                          {book.attempted}/{book.totalQuestions} · 진도 {progress}%
                        </span>
                        <span>정답률 {correctRate}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-accent text-foreground">
                          {book.subjectName}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Add books section */}
        {!loading && allBooks.length > 0 && (
          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">교재 추가</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allBooks
                .filter((b) => !userBookIds.has(b.id))
                .map((book) => {
                  const subj = subjectMap.get(book.subjectId);
                  return (
                    <button
                      key={book.id}
                      onClick={() => addBook(book.id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card text-left hover:bg-accent/40 hover:shadow-sm transition-all"
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {subj?.name || "기타"}
                          {book.author && ` · ${book.author}`}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
