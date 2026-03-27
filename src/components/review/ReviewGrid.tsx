import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import ReviewCell, { type CellResult } from "./ReviewCell";
import ChapterTabs from "./ChapterTabs";
import FloatingInputBar from "./FloatingInputBar";
import InputGuide from "./InputGuide";
import MemoPopover from "./MemoPopover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  userId?: string; // view another user's data (read-only)
}

type SectionFilter = "all" | "example" | "past_exam" | "practice";
type ActiveCell = { qIdx: number; rIdx: number } | null;

interface FilterConfig {
  show_type_filters: boolean;
  show_star_filter: boolean;
  show_essential_filter: boolean;
  show_exam_year_column: boolean;
}

export default function ReviewGrid({ bookId, roundCount = 3, readOnly: readOnlyProp = false, initialChapterId, singleChapter = false, userId }: ReviewGridProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const targetUserId = userId ?? user?.id;
  const readOnly = readOnlyProp || !!userId;
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(initialChapterId ?? null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(!singleChapter);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [essentialOnly, setEssentialOnly] = useState(false);
  const [examYearFilter, setExamYearFilter] = useState(false);
  const [memoOnly, setMemoOnly] = useState(false);
  const [resultFilter, setResultFilter] = useState<string>("off");
  const [activeCell, setActiveCell] = useState<ActiveCell>(null);
  const [skippedSet, setSkippedSet] = useState<Set<string>>(new Set());
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ show_type_filters: true, show_star_filter: false, show_essential_filter: false, show_exam_year_column: false });

  // Fetch filter_config for this book
  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("books")
        .select("filter_config")
        .eq("id", bookId)
        .single();
      if (data?.filter_config) {
        setFilterConfig(data.filter_config as unknown as FilterConfig);
      }
    };
    fetchConfig();
  }, [bookId]);
  // Filtered indices mapping
  const filtered = questions.filter((q) => {
    if (sectionFilter !== "all" && q.questionType !== sectionFilter) return false;
    if (essentialOnly && !q.isEssential) return false;
    if (examYearFilter && q.examYear !== '2유') return false;
    if (memoOnly && !(memos[q.questionId]?.trim())) return false;
    if (resultFilter !== "off") {
      const [type, countStr] = resultFilter.split("-");
      const minCount = parseInt(countStr, 10);
      const targetResult = type === "wrong" ? "wrong" : "half";
      const count = q.rounds.filter((r) => r.result === targetResult).length;
      if (count < minCount) return false;
    }
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
    const fetchChapters = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("chapters")
        .select("id, title, chapter_number")
        .eq("book_id", bookId)
        .order("display_order");
      if (error || !data) { setLoading(false); return; }
      const mapped = data.map((c: any) => ({ id: c.id, title: c.title, number: c.chapter_number }));
      setChapters(mapped);

      // Find the chapter with the most recent attempt
      let targetChapterId = mapped[0]?.id ?? null;
      if (targetUserId && mapped.length > 0) {
        const chapterIds = mapped.map((c) => c.id);
        const { data: recentAttempt } = await supabase
          .from("attempts")
          .select("question_id, attempted_at, questions!inner(chapter_id)")
          .eq("user_id", targetUserId)
          .in("questions.chapter_id", chapterIds)
          .order("attempted_at", { ascending: false })
          .limit(1);

        if (recentAttempt && recentAttempt.length > 0) {
          const lastChapterId = (recentAttempt[0] as any).questions?.chapter_id;
          if (lastChapterId && chapterIds.includes(lastChapterId)) {
            targetChapterId = lastChapterId;
          }
        }
      }

      setSelectedChapterId(targetChapterId);
      setLoading(false);
    };
    fetchChapters();
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
      if (targetUserId && qData.length > 0) {
        const qIds = qData.map((q: any) => q.id);
        const isViewingOther = !!userId;
        const [{ data: aData }, { data: skipData }, { data: memoData }] = await Promise.all([
          supabase
            .from("attempts")
            .select("question_id, result, round, attempted_at")
            .eq("user_id", targetUserId)
            .in("question_id", qIds)
            .order("round"),
          isViewingOther
            ? Promise.resolve({ data: [] })
            : supabase
                .from("user_question_skips")
                .select("question_id")
                .eq("user_id", targetUserId)
                .in("question_id", qIds),
          isViewingOther
            ? Promise.resolve({ data: [] })
            : supabase
                .from("user_question_memos" as any)
                .select("question_id, content")
                .eq("user_id", targetUserId)
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
        const memoMap: Record<string, string> = {};
        for (const m of (memoData ?? []) as any[]) {
          memoMap[m.question_id] = m.content;
        }
        setMemos(memoMap);
      } else {
        setSkippedSet(new Set());
        setMemos({});
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
  }, [selectedChapterId, targetUserId, roundCount]);

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

  // Save memo
  const saveMemo = useCallback(
    async (questionId: string, content: string) => {
      if (!user) return;
      setMemos((prev) => {
        const next = { ...prev };
        if (content) next[questionId] = content;
        else delete next[questionId];
        return next;
      });
      if (content) {
        await supabase.from("user_question_memos" as any).upsert(
          { user_id: user.id, question_id: questionId, content, updated_at: new Date().toISOString() },
          { onConflict: "user_id,question_id" }
        );
      } else {
        await supabase.from("user_question_memos" as any).delete().eq("user_id", user.id).eq("question_id", questionId);
      }
    },
    [user]
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

  // Detect if this book uses past_exam type — if not, use 기본/응용 labels
  const hasPastExam = questions.some((q) => q.questionType === "past_exam");

  const sectionFilters: { key: SectionFilter; label: string }[] = hasPastExam
    ? [
        { key: "all", label: "전체" },
        { key: "example", label: "예제" },
        { key: "past_exam", label: "기출" },
        { key: "practice", label: "실전" },
      ]
    : [
        { key: "all", label: "전체" },
        { key: "example", label: "기본" },
        { key: "practice", label: "응용" },
      ];

  // Group by type
  const groupedByType = () => {
    if (sectionFilter !== "all" || resultFilter !== "off") return [{ type: sectionFilter !== "all" ? sectionFilter : "all", rows: filtered }];
    const groups: { type: string; rows: QuestionRow[] }[] = [];
    const typeOrder: QuestionType[] = hasPastExam ? ["example", "past_exam", "practice"] : ["example", "practice"];
    for (const t of typeOrder) {
      const rows = filtered.filter((q) => q.questionType === t);
      if (rows.length > 0) groups.push({ type: t, rows });
    }
    return groups;
  };

  const typeLabels: Record<string, string> = hasPastExam
    ? { example: "예제", past_exam: "기출문제", practice: "실전연습" }
    : { example: "기본문제", practice: "응용문제" };

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
    <div className="space-y-2">
      {!singleChapter && <ChapterTabs chapters={chapters} selectedId={selectedChapterId} onSelect={setSelectedChapterId} />}

      {/* Section filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        {filterConfig.show_type_filters && sectionFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setSectionFilter(f.key); setActiveCell(null); }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
              sectionFilter === f.key
                ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                : "bg-card text-muted-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
            )}
          >
            {f.label}
          </button>
        ))}
        {filterConfig.show_type_filters && <div className="w-px h-4 bg-border mx-0.5" />}
        {filterConfig.show_star_filter && (
          <button
            onClick={() => { setExamYearFilter((v) => !v); setActiveCell(null); }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
              examYearFilter
                ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                : "bg-card text-muted-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
            )}
          >
            ★ 2유
          </button>
        )}
        {/* Essential filter */}
        {filterConfig.show_essential_filter && (
          <button
            onClick={() => { setEssentialOnly((v) => !v); setActiveCell(null); }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
              essentialOnly
                ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                : "bg-card text-muted-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
            )}
          >
            ★ 필수
          </button>
        )}
        <button
          onClick={() => { setMemoOnly((v) => !v); setActiveCell(null); }}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
            memoOnly
              ? "bg-[#DA77D1] text-white border-[#DA77D1]"
              : "bg-card text-muted-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
          )}
        >
          📝
        </button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <Select value={resultFilter} onValueChange={(v) => { setResultFilter(v); setActiveCell(null); }}>
          <SelectTrigger className={cn(
            "h-auto px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap w-auto min-w-0 gap-1 [&>svg]:h-3 [&>svg]:w-3 border",
            resultFilter !== "off"
              ? "bg-[#DA77D1] text-white border-[#DA77D1]"
              : "bg-card text-muted-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">필터 없음</SelectItem>
            <SelectItem value="wrong-1">1✕ 이상</SelectItem>
            <SelectItem value="wrong-2">2✕ 이상</SelectItem>
            <SelectItem value="wrong-3">3✕ 이상</SelectItem>
            <SelectItem value="half-1">1△ 이상</SelectItem>
            <SelectItem value="half-2">2△ 이상</SelectItem>
            <SelectItem value="half-3">3△ 이상</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Floating input guide button */}
      {!readOnly && <InputGuide />}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted-foreground">해당 유형의 문항이 없습니다.</div>
      ) : (
        <div className={cn("rounded-2xl overflow-hidden bg-card border border-[hsl(0,0%,0%,0.08)]", activeCell && "mb-16")}
          style={{ boxShadow: "0 1px 3px hsl(0 0% 0% / 0.04)" }}
        >
          <div className={isMobile ? "overflow-hidden" : "overflow-x-auto"}>
            <table className={cn("w-full border-collapse text-xs", isMobile && "table-fixed")}>
              {isMobile && (
                <colgroup>
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "17%" }} />
                  {Array.from({ length: roundCount }, (_, i) => (
                    <col key={i} style={{ width: `${Math.floor(68 / roundCount)}%` }} />
                  ))}
                </colgroup>
              )}
              <thead>
                <tr className="bg-[#fafafa]">
                  <th className={cn("z-10 bg-[#fafafa] px-0.5 py-2.5 text-center font-semibold text-muted-foreground border-b border-r border-[hsl(0,0%,0%,0.06)] text-[10px]", !isMobile && "sticky left-0 w-9 px-1")}>#</th>
                  <th className={cn("z-10 bg-[#fafafa] px-0.5 py-2.5 text-left font-semibold text-muted-foreground border-b border-r border-[hsl(0,0%,0%,0.06)] text-[10px]", !isMobile && "sticky left-9 min-w-[80px] px-1")}>{filterConfig.show_exam_year_column ? "기출" : "주제"}</th>
                  {!isMobile && (
                    <th className="sticky left-[76px] z-10 bg-[#fafafa] min-w-[100px] px-2 py-2.5 text-left font-semibold text-muted-foreground border-b border-r border-[hsl(0,0%,0%,0.06)] text-[10px]">{filterConfig.show_exam_year_column ? "기출" : "주제"}</th>
                  )}
                  {Array.from({ length: roundCount }, (_, i) => (
                    <th key={i} className="px-0.5 md:px-1 py-2.5 text-center font-semibold text-muted-foreground border-b border-r border-[hsl(0,0%,0%,0.06)] last:border-r-0 text-[10px]">
                      {i + 1}회
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedByType().map((group) => (
                  <>
                    {sectionFilter === "all" && resultFilter === "off" && (
                       <tr key={`header-${group.type}`}>
                        <td colSpan={(isMobile ? 2 : 3) + roundCount} className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground bg-[#fafafa] border-b border-[hsl(0,0%,0%,0.06)] uppercase tracking-wider">
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
                            className={cn("z-10 px-0.5 py-0 text-center border-b border-r border-[hsl(0,0%,0%,0.06)] cursor-pointer select-none", !isMobile && "sticky left-0 w-9 px-1", isActiveRow ? "bg-primary/5" : "bg-card")}
                            onClick={() => toggleSkip(q.questionId)}
                          >
                            <div className="flex flex-col items-center leading-none gap-0">
                              <span className={cn(
                                "font-medium text-[11px] transition-all",
                                isSkipped && "line-through decoration-2 text-muted-foreground",
                                !isSkipped && q.isEssential ? "text-primary font-bold" : !isSkipped ? "text-foreground" : "",
                                !isSkipped && "hover:text-muted-foreground/70"
                              )}>
                                {q.isEssential ? "★" : ""}{q.questionNumber}
                              </span>
                              {q.examYear && q.examYear !== '2유' && (
                                <span className="text-[7px] text-orange-500 font-medium leading-none">
                                  {q.examYear}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={cn("z-10 px-0.5 py-0 text-left border-b border-r border-[hsl(0,0%,0%,0.06)]", !isMobile && "sticky left-9 w-10 min-w-[80px]", isActiveRow ? "bg-primary/5" : "bg-card")}>
                            <span className="text-[9px] text-muted-foreground truncate block max-w-[80px] md:max-w-[120px]">
                              {filterConfig.show_exam_year_column
                                ? (q.examYear ? `${q.examYear} 기출` : "–")
                                : (q.topic || "–")}
                            </span>
                          </td>
                          {!isMobile && (
                            <td className={cn("sticky left-[76px] z-10 min-w-[100px] px-2 py-0 text-left border-b border-r border-[hsl(0,0%,0%,0.06)]", isActiveRow ? "bg-primary/5" : "bg-card")}>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                  {filterConfig.show_exam_year_column
                                    ? (q.examYear ? `${q.examYear} 기출` : "–")
                                    : (q.topic || "–")}
                                </span>
                                {!readOnly && (
                                  <MemoPopover
                                    memo={memos[q.questionId] ?? ""}
                                    onSave={(content) => saveMemo(q.questionId, content)}
                                  />
                                )}
                              </div>
                            </td>
                          )}
                          {q.rounds.map((round, rIdx) => (
                            <td key={rIdx} className="p-0 border-b border-r border-[hsl(0,0%,0%,0.06)] last:border-r-0">
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
