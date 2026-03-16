import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ReviewCell, { type CellResult } from "./ReviewCell";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { QuestionType } from "@/integrations/supabase/types/database";

export interface ChapterData {
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  questions: {
    questionId: string;
    questionNumber: number;
    questionType: QuestionType;
    isEssential: boolean;
    examYear: string | null;
    rounds: { result: CellResult; date?: string }[];
  }[];
}

interface ReviewGridProps {
  bookId: string;
  roundCount?: number;
  readOnly?: boolean;
}

type SectionFilter = "all" | "example" | "past_exam" | "practice";
type ColorFilter = "all" | "correct" | "wrong" | "half";

export default function ReviewGrid({ bookId, roundCount = 3, readOnly = false }: ReviewGridProps) {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [colorFilter, setColorFilter] = useState<ColorFilter>("all");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch chapters for this book
      const { data: chaptersData, error: chaptersErr } = await supabase
        .from("chapters")
        .select("id, title, chapter_number")
        .eq("book_id", bookId)
        .order("display_order");

      if (chaptersErr || !chaptersData) {
        setLoading(false);
        return;
      }

      // Fetch questions for these chapters
      const chapterIds = chaptersData.map((c: any) => c.id);
      const { data: questionsData, error: questionsErr } = await supabase
        .from("questions")
        .select("id, chapter_id, question_number, question_type, is_essential, exam_year")
        .in("chapter_id", chapterIds)
        .order("question_number");

      if (questionsErr) {
        setLoading(false);
        return;
      }

      // Fetch user attempts for these questions
      let attemptsMap: Record<string, { result: CellResult; date?: string }[]> = {};
      if (user && questionsData) {
        const questionIds = questionsData.map((q: any) => q.id);
        if (questionIds.length > 0) {
          const { data: attemptsData } = await supabase
            .from("attempts")
            .select("question_id, is_correct, attempted_at")
            .eq("user_id", user.id)
            .in("question_id", questionIds)
            .order("attempted_at");

          if (attemptsData) {
            for (const a of attemptsData as any[]) {
              if (!attemptsMap[a.question_id]) attemptsMap[a.question_id] = [];
              attemptsMap[a.question_id].push({
                result: a.is_correct ? "correct" : "wrong",
                date: new Date(a.attempted_at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }),
              });
            }
          }
        }
      }

      // Build chapter data
      const result: ChapterData[] = chaptersData.map((c: any) => {
        const qs = (questionsData ?? [])
          .filter((q: any) => q.chapter_id === c.id)
          .map((q: any) => {
            const existingRounds = attemptsMap[q.id] ?? [];
            const rounds = Array.from({ length: roundCount }, (_, i) => existingRounds[i] ?? { result: null });
            return {
              questionId: q.id,
              questionNumber: q.question_number,
              questionType: q.question_type as QuestionType,
              isEssential: q.is_essential,
              examYear: q.exam_year,
              rounds,
            };
          });
        return {
          chapterId: c.id,
          chapterTitle: c.title,
          chapterNumber: c.chapter_number,
          questions: qs,
        };
      });

      setChapters(result);
      setLoading(false);
    };

    fetchData();
  }, [bookId, user, roundCount]);

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCellChange = useCallback(
    (chapterIdx: number, qIdx: number, roundIdx: number, result: CellResult) => {
      setChapters((prev) => {
        const next = [...prev];
        const chapter = { ...next[chapterIdx] };
        const questions = [...chapter.questions];
        const q = { ...questions[qIdx] };
        const rounds = [...q.rounds];
        rounds[roundIdx] = {
          ...rounds[roundIdx],
          result,
          date: result ? new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) : undefined,
        };
        q.rounds = rounds;
        questions[qIdx] = q;
        chapter.questions = questions;
        next[chapterIdx] = chapter;
        return next;
      });
    },
    []
  );

  const sectionFilters: { key: SectionFilter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "example", label: "예제" },
    { key: "past_exam", label: "기출" },
    { key: "practice", label: "실전" },
  ];

  const colorFilters: { key: ColorFilter; label: string; className: string }[] = [
    { key: "all", label: "전체", className: "" },
    { key: "wrong", label: "X", className: "text-destructive" },
    { key: "half", label: "△", className: "text-warning" },
    { key: "correct", label: "O", className: "text-success" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">문항 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section filter */}
      <div className="flex gap-1.5">
        {sectionFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setSectionFilter(f.key)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border",
              sectionFilter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Color filter + controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {colorFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setColorFilter(f.key)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-all border",
                colorFilter === f.key
                  ? "bg-foreground text-background border-foreground"
                  : `bg-secondary border-border ${f.className || "text-secondary-foreground"} hover:bg-accent`
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-2">
        {chapters.map((chapter, chapterIdx) => {
          const filteredQuestions = chapter.questions.filter((q) => {
            if (sectionFilter !== "all" && q.questionType !== sectionFilter) return false;
            if (colorFilter !== "all") return q.rounds.some((r) => r.result === colorFilter);
            return true;
          });

          if (sectionFilter !== "all" && filteredQuestions.length === 0) return null;

          const expanded = expandedChapters.has(chapter.chapterId);
          const allResults = filteredQuestions.flatMap((q) => q.rounds.map((r) => r.result)).filter(Boolean);
          const correctCount = allResults.filter((r) => r === "correct").length;
          const totalCount = allResults.length;

          // Count by section
          const exCount = chapter.questions.filter((q) => q.questionType === "example").length;
          const peCount = chapter.questions.filter((q) => q.questionType === "past_exam").length;
          const prCount = chapter.questions.filter((q) => q.questionType === "practice").length;

          return (
            <div key={chapter.chapterId} className="rounded-lg border border-border overflow-hidden bg-card">
              <button
                onClick={() => toggleChapter(chapter.chapterId)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-muted-foreground font-mono w-5 text-right flex-shrink-0">
                    {chapter.chapterNumber}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">{chapter.chapterTitle}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[9px] text-muted-foreground">
                    {exCount > 0 && `예${exCount}`}
                    {peCount > 0 && ` 기${peCount}`}
                    {prCount > 0 && ` 실${prCount}`}
                  </span>
                  {totalCount > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round((correctCount / totalCount) * 100)}%
                    </span>
                  )}
                  <span className={cn("text-xs transition-transform", expanded && "rotate-90")}>▶</span>
                </div>
              </button>

              {expanded && (
                <div className="border-t border-border">
                  <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `64px repeat(${roundCount}, 1fr)` }}>
                    <div className="bg-muted px-2 py-1.5 text-[10px] font-medium text-muted-foreground text-center">
                      문항
                    </div>
                    {Array.from({ length: roundCount }, (_, i) => (
                      <div key={i} className="bg-muted px-2 py-1.5 text-[10px] font-medium text-muted-foreground text-center">
                        {i + 1}회독
                      </div>
                    ))}
                  </div>

                  {filteredQuestions.map((q) => {
                    const originalIdx = chapter.questions.indexOf(q);
                    const typeLabel = q.questionType === "past_exam" ? "기" : q.questionType === "practice" ? "실" : "";

                    return (
                      <div
                        key={q.questionId}
                        className="grid gap-px bg-border"
                        style={{ gridTemplateColumns: `64px repeat(${roundCount}, 1fr)` }}
                      >
                        <div className="bg-card flex items-center justify-center gap-0.5 text-xs">
                          {typeLabel && (
                            <span className={cn(
                              "text-[8px] font-bold",
                              q.questionType === "past_exam" ? "text-blue-500" : "text-orange-500"
                            )}>
                              {typeLabel}
                            </span>
                          )}
                          <span className={cn(
                            "font-medium",
                            q.isEssential ? "text-primary" : "text-muted-foreground"
                          )}>
                            {q.questionNumber}
                          </span>
                          {q.examYear && (
                            <span className="text-[7px] text-muted-foreground">'{q.examYear.slice(-2)}</span>
                          )}
                        </div>
                        {q.rounds.map((round, roundIdx) => (
                          <div key={roundIdx} className="bg-card p-0.5">
                            <ReviewCell
                              result={round.result}
                              date={round.date}
                              realtimeMode={false}
                              readOnly={readOnly}
                              onChange={(result) => handleCellChange(chapterIdx, originalIdx, roundIdx, result)}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
