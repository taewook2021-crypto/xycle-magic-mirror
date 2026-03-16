import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ReviewCell, { type CellResult } from "./ReviewCell";
import ChapterTabs from "./ChapterTabs";
import FloatingInputBar from "./FloatingInputBar";
import InputGuide from "./InputGuide";
import MemoPopover from "./MemoPopover";
import { cn } from "@/lib/utils";
import type { QuestionType } from "@/integrations/supabase/types/database";

interface QuestionRow {
  questionId: string;
  questionNumber: number;
  questionType: QuestionType;
  isEssential: boolean;
  examYear: string | null;
  topic: string | null;
  rounds: { result: CellResult; date?: string }[];
}

interface ChapterInfo {
  id: string;
  title: string;
  number: number;
}

interface ReviewGridProps {
  bookId: string;
  roundCount?: number;
  readOnly?: boolean;
  initialChapterId?: string;
  singleChapter?: boolean;
}

type SectionFilter = "all" | "example" | "past_exam" | "practice";
type ActiveCell = { qIdx: number; rIdx: number } | null;

export default function ReviewGrid({ bookId, roundCount = 3, readOnly = false, initialChapterId, singleChapter = false }: ReviewGridProps) {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(initialChapterId ?? null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(!singleChapter);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [essentialOnly, setEssentialOnly] = useState(false);
  const [activeCell, setActiveCell] = useState<ActiveCell>(null);
  const [skippedSet, setSkippedSet] = useState<Set<string>>(new Set());
  const [memos, setMemos] = useState<Record<string, string>>({});

  // Filtered indices mapping
  const filtered = questions.filter((q) => {
    if (sectionFilter !== "all" && q.questionType !== sectionFilter) return false;
    if (essentialOnly && !q.isEssential) return false;
    return true;
  });

  // Build visual order: grouped by type (example → past_exam → practice), matching render order
  const visualOrder = useMemo(() => {
    const order: number[] = [];
    if (sectionFilter !== "all") {
      for (const q of filtered) order.push(questions.indexOf(q));
    } else {
      const typeOrder: QuestionType[] = ["example", "past_exam", "practice"];
      for (const t of typeOrder) {
        for (const q of filtered) {
          if (q.questionType === t) order.push(questions.indexOf(q));
        }
      }
    }
    return order;
  }, [filtered, questions, sectionFilter]);

  // Keep filteredGlobalIndices as alias for backward compat
  const filteredGlobalIndices = visualOrder;

  // Fetch chapters (skip if singleChapter mode)
  useEffect(() => {
    if (singleChapter) {
      // Already have chapterId, set it directly
      if (initialChapterId) setSelectedChapterId(initialChapterId);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("chapters")
        .select("id, title, chapter_number")
        .eq("book_id", bookId)
        .order("display_order");
      if (error || !data) { setLoading(false); return; }
      const mapped = data.map((c: any) => ({ id: c.id, title: c.title, number: c.chapter_number }));
      setChapters(mapped);
      if (mapped.length > 0) setSelectedChapterId(mapped[0].id);
      setLoading(false);
    };
    fetch();
  }, [bookId, singleChapter, initialChapterId]);

  // Fetch questions + skips
  useEffect(() => {
    if (!selectedChapterId) return;
    const fetchQuestions = async () => {
      const { data: qData, error: qErr } = await supabase
        .from("questions")
        .select("id, question_number, question_type, is_essential, exam_year, topic")
        .eq("chapter_id", selectedChapterId)
        .order("question_number");
      if (qErr || !qData) return;

      let attemptsMap: Record<string, { result: CellResult; date?: string }[]> = {};
      if (user && qData.length > 0) {
        const qIds = qData.map((q: any) => q.id);
        const [{ data: aData }, { data: skipData }] = await Promise.all([
          supabase
            .from("attempts")
            .select("question_id, result, round, attempted_at")
            .eq("user_id", user.id)
            .in("question_id", qIds)
            .order("round"),
          supabase
            .from("user_question_skips")
            .select("question_id")
            .eq("user_id", user.id)
            .in("question_id", qIds),
        ]);
        if (aData) {
          for (const a of aData as any[]) {
            if (!attemptsMap[a.question_id]) attemptsMap[a.question_id] = [];
            const roundIdx = (a.round ?? 1) - 1;
            // Ensure array is long enough
            while (attemptsMap[a.question_id].length <= roundIdx) {
              attemptsMap[a.question_id].push({ result: null });
            }
            attemptsMap[a.question_id][roundIdx] = {
              result: a.result as CellResult,
              date: new Date(a.attempted_at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }),
            };
          }
        }
        setSkippedSet(new Set((skipData ?? []).map((s: any) => s.question_id)));
      } else {
        setSkippedSet(new Set());
      }

      const rows: QuestionRow[] = qData.map((q: any) => {
        const existing = attemptsMap[q.id] ?? [];
        return {
          questionId: q.id,
          questionNumber: q.question_number,
          questionType: q.question_type as QuestionType,
          isEssential: q.is_essential,
          examYear: q.exam_year,
          topic: q.topic,
          rounds: Array.from({ length: roundCount }, (_, i) => existing[i] ?? { result: null }),
        };
      });
      setQuestions(rows);
    };
    fetchQuestions();
    setActiveCell(null);
  }, [selectedChapterId, user, roundCount]);

  // Toggle skip
  const toggleSkip = useCallback(
    async (questionId: string) => {
      if (!user) return;
      const isSkipped = skippedSet.has(questionId);
      if (isSkipped) {
        setSkippedSet((prev) => { const next = new Set(prev); next.delete(questionId); return next; });
        await supabase.from("user_question_skips").delete().eq("user_id", user.id).eq("question_id", questionId);
      } else {
        setSkippedSet((prev) => new Set(prev).add(questionId));
        await supabase.from("user_question_skips").insert({ user_id: user.id, question_id: questionId });
      }
    },
    [user, skippedSet]
  );

  // Apply result to active cell + auto-advance + persist
  const applyResult = useCallback(
    (result: CellResult) => {
      if (!activeCell || !user) return;
      const { qIdx, rIdx } = activeCell;
      const questionId = questions[qIdx]?.questionId;
      if (!questionId) return;

      setQuestions((prev) => {
        const next = [...prev];
        const q = { ...next[qIdx] };
        const rounds = [...q.rounds];
        rounds[rIdx] = {
          result,
          date: result ? new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) : undefined,
        };
        q.rounds = rounds;
        next[qIdx] = q;
        return next;
      });

      // Persist to Supabase
      if (result) {
        supabase.from("attempts").upsert(
          {
            user_id: user.id,
            question_id: questionId,
            round: rIdx + 1,
            result,
            is_correct: result === "correct",
            student_answer: 0,
          },
          { onConflict: "user_id,question_id,round" }
        ).then();
      }

      // Auto-advance: next visible non-skipped row (using visualOrder)
      const currentVisualIdx = visualOrder.indexOf(qIdx);
      for (let i = currentVisualIdx + 1; i < visualOrder.length; i++) {
        const nextIdx = visualOrder[i];
        if (!skippedSet.has(questions[nextIdx].questionId)) {
          setActiveCell({ qIdx: nextIdx, rIdx });
          break;
        }
      }
    },
    [activeCell, user, questions, visualOrder, skippedSet]
  );

  const clearAndMoveUp = useCallback(() => {
    if (!activeCell || !user) return;
    const { qIdx, rIdx } = activeCell;
    const questionId = questions[qIdx]?.questionId;

    // Clear the cell
    setQuestions((prev) => {
      const next = [...prev];
      const q = { ...next[qIdx] };
      const rounds = [...q.rounds];
      rounds[rIdx] = { result: null };
      q.rounds = rounds;
      next[qIdx] = q;
      return next;
    });

    // Delete from Supabase
    if (questionId) {
      supabase.from("attempts").delete()
        .eq("user_id", user.id)
        .eq("question_id", questionId)
        .eq("round", rIdx + 1)
        .then();
    }
    // Move up
    const fIdx = filteredGlobalIndices.indexOf(qIdx);
    if (fIdx > 0) {
      setActiveCell({ qIdx: filteredGlobalIndices[fIdx - 1], rIdx });
    }
  }, [activeCell, user, questions, filteredGlobalIndices]);

  // Keyboard navigation
  useEffect(() => {
    if (readOnly || !activeCell) return;
    const handleKey = (e: KeyboardEvent) => {
      const { qIdx, rIdx } = activeCell;
      const fIdx = filteredGlobalIndices.indexOf(qIdx);

      switch (e.key) {
        case "1":
          e.preventDefault();
          applyResult("correct");
          break;
        case "2":
          e.preventDefault();
          applyResult("half");
          break;
        case "3":
          e.preventDefault();
          applyResult("wrong");
          break;
        case "0":
        case "Backspace":
          e.preventDefault();
          clearAndMoveUp();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (fIdx > 0) setActiveCell({ qIdx: filteredGlobalIndices[fIdx - 1], rIdx });
          break;
        case "ArrowDown":
          e.preventDefault();
          if (fIdx < filteredGlobalIndices.length - 1) setActiveCell({ qIdx: filteredGlobalIndices[fIdx + 1], rIdx });
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (rIdx > 0) setActiveCell({ qIdx, rIdx: rIdx - 1 });
          break;
        case "ArrowRight":
          e.preventDefault();
          if (rIdx < roundCount - 1) setActiveCell({ qIdx, rIdx: rIdx + 1 });
          break;
        case "Escape":
          e.preventDefault();
          setActiveCell(null);
          break;
        case "s":
        case "S":
          e.preventDefault();
          toggleSkip(questions[qIdx].questionId);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeCell, readOnly, filteredGlobalIndices, roundCount, applyResult, clearAndMoveUp, toggleSkip, questions]);

  const navigate = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      if (!activeCell) return;
      const { qIdx, rIdx } = activeCell;
      const fIdx = filteredGlobalIndices.indexOf(qIdx);
      switch (dir) {
        case "up":
          if (fIdx > 0) setActiveCell({ qIdx: filteredGlobalIndices[fIdx - 1], rIdx });
          break;
        case "down":
          if (fIdx < filteredGlobalIndices.length - 1) setActiveCell({ qIdx: filteredGlobalIndices[fIdx + 1], rIdx });
          break;
        case "left":
          if (rIdx > 0) setActiveCell({ qIdx, rIdx: rIdx - 1 });
          break;
        case "right":
          if (rIdx < roundCount - 1) setActiveCell({ qIdx, rIdx: rIdx + 1 });
          break;
      }
    },
    [activeCell, filteredGlobalIndices, roundCount]
  );

  // Section filter config
  const sectionFilters: { key: SectionFilter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "example", label: "예제" },
    { key: "past_exam", label: "기출" },
    { key: "practice", label: "실전" },
  ];

  // Group by type
  const groupedByType = () => {
    if (sectionFilter !== "all") return [{ type: sectionFilter, rows: filtered }];
    const groups: { type: string; rows: QuestionRow[] }[] = [];
    const typeOrder: QuestionType[] = ["example", "past_exam", "practice"];
    for (const t of typeOrder) {
      const rows = filtered.filter((q) => q.questionType === t);
      if (rows.length > 0) groups.push({ type: t, rows });
    }
    return groups;
  };

  const typeLabels: Record<string, string> = {
    example: "예제",
    past_exam: "기출문제",
    practice: "실전연습",
  };

  const activeQuestion = activeCell ? questions[activeCell.qIdx] : undefined;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!singleChapter && chapters.length === 0) {
    return <div className="text-center py-12 text-sm text-muted-foreground">문항 데이터가 없습니다.</div>;
  }

  return (
    <div className="space-y-3">
      {!singleChapter && <ChapterTabs chapters={chapters} selectedId={selectedChapterId} onSelect={setSelectedChapterId} />}

      {/* Section filter pills */}
      <div className="flex items-center gap-1.5">
        {sectionFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setSectionFilter(f.key); setActiveCell(null); }}
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
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => { setEssentialOnly((v) => !v); setActiveCell(null); }}
          className={cn(
            "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border",
            essentialOnly
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
          )}
        >
          ★ 필수
        </button>
      </div>

      {/* Floating input guide button */}
      {!readOnly && <InputGuide />}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted-foreground">해당 유형의 문항이 없습니다.</div>
      ) : (
        <div className={cn("border border-border rounded-lg overflow-hidden bg-card", activeCell && "mb-16")}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted/60">
                  <th className="sticky left-0 z-10 bg-muted/60 w-10 px-2 py-2 text-center font-semibold text-muted-foreground border-b border-r border-border">#</th>
                  <th className="sticky left-10 z-10 bg-muted/60 w-12 px-1 py-2 text-center font-semibold text-muted-foreground border-b border-r border-border">유형</th>
                  <th className="sticky left-[88px] z-10 bg-muted/60 min-w-[120px] px-2 py-2 text-left font-semibold text-muted-foreground border-b border-r border-border">주제</th>
                  {Array.from({ length: roundCount }, (_, i) => (
                    <th key={i} className="px-2 py-2 text-center font-semibold text-muted-foreground border-b border-r border-border last:border-r-0 min-w-[56px]">
                      {i + 1}회독
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedByType().map((group) => (
                  <>
                    {sectionFilter === "all" && (
                      <tr key={`header-${group.type}`}>
                        <td colSpan={3 + roundCount} className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground bg-muted/30 border-b border-border uppercase tracking-wider">
                          {typeLabels[group.type]} ({group.rows.length})
                        </td>
                      </tr>
                    )}
                    {group.rows.map((q) => {
                      const globalIdx = questions.indexOf(q);
                      const isActiveRow = activeCell?.qIdx === globalIdx;
                      const isSkipped = skippedSet.has(q.questionId);
                      return (
                        <tr key={q.questionId} className={cn("transition-colors", isSkipped && "opacity-40", isActiveRow ? "bg-primary/5" : "hover:bg-accent/20")}>
                          <td
                            className={cn("sticky left-0 z-10 w-10 px-2 py-0 text-center border-b border-r border-border cursor-pointer select-none", isActiveRow ? "bg-primary/5" : "bg-card")}
                            onClick={() => toggleSkip(q.questionId)}
                          >
                            <span className={cn(
                              "font-medium text-xs transition-all",
                              isSkipped && "line-through decoration-2 text-muted-foreground",
                              !isSkipped && q.isEssential ? "text-primary font-bold" : !isSkipped ? "text-foreground" : "",
                              !isSkipped && "hover:text-muted-foreground/70"
                            )}>
                              {q.questionNumber}
                            </span>
                          </td>
                          <td className={cn("sticky left-10 z-10 w-12 px-1 py-0 text-center border-b border-r border-border", isActiveRow ? "bg-primary/5" : "bg-card")}>
                            <span className="text-[9px] text-muted-foreground">
                              {q.questionType === "past_exam" && (
                                <span className="text-primary/70 font-semibold">{q.examYear ? `${q.examYear.slice(-2)}기출` : "기출"}</span>
                              )}
                              {q.questionType === "practice" && <span className="font-semibold">실전</span>}
                              {q.questionType === "example" && <span className="font-semibold">예제</span>}
                            </span>
                          </td>
                          <td className={cn("sticky left-[88px] z-10 min-w-[120px] px-2 py-0 text-left border-b border-r border-border", isActiveRow ? "bg-primary/5" : "bg-card")}>
                            <span className="text-[10px] text-muted-foreground truncate block max-w-[160px]">{q.topic || "–"}</span>
                          </td>
                          {q.rounds.map((round, rIdx) => (
                            <td key={rIdx} className="p-0 border-b border-r border-border last:border-r-0">
                              <ReviewCell
                                result={round.result}
                                date={round.date}
                                readOnly={readOnly || isSkipped}
                                isActive={!isSkipped && activeCell?.qIdx === globalIdx && activeCell?.rIdx === rIdx}
                                onChange={() => {}}
                                onSelect={() => { if (!isSkipped) setActiveCell({ qIdx: globalIdx, rIdx }); }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating input bar */}
      {!readOnly && (
        <FloatingInputBar
          visible={activeCell !== null}
          currentQuestion={
            activeQuestion
              ? { number: activeQuestion.questionNumber, round: (activeCell?.rIdx ?? 0) + 1 }
              : undefined
          }
          onInput={applyResult}
          onClear={clearAndMoveUp}
          onClose={() => setActiveCell(null)}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}
