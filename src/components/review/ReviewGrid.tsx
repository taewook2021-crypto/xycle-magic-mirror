import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ReviewCell, { type CellResult } from "./ReviewCell";
import ChapterTabs from "./ChapterTabs";
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
}

type SectionFilter = "all" | "example" | "past_exam" | "practice";

export default function ReviewGrid({ bookId, roundCount = 3, readOnly = false }: ReviewGridProps) {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [essentialOnly, setEssentialOnly] = useState(false);

  // Fetch chapters list
  useEffect(() => {
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
  }, [bookId]);

  // Fetch questions for selected chapter
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
        const { data: aData } = await supabase
          .from("attempts")
          .select("question_id, is_correct, attempted_at")
          .eq("user_id", user.id)
          .in("question_id", qIds)
          .order("attempted_at");

        if (aData) {
          for (const a of aData as any[]) {
            if (!attemptsMap[a.question_id]) attemptsMap[a.question_id] = [];
            attemptsMap[a.question_id].push({
              result: a.is_correct ? "correct" : "wrong",
              date: new Date(a.attempted_at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }),
            });
          }
        }
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
  }, [selectedChapterId, user, roundCount]);

  const handleCellChange = useCallback(
    (qIdx: number, roundIdx: number, result: CellResult) => {
      setQuestions((prev) => {
        const next = [...prev];
        const q = { ...next[qIdx] };
        const rounds = [...q.rounds];
        rounds[roundIdx] = {
          result,
          date: result ? new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) : undefined,
        };
        q.rounds = rounds;
        next[qIdx] = q;
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

  const filtered = questions.filter((q) => {
    if (sectionFilter !== "all" && q.questionType !== sectionFilter) return false;
    if (essentialOnly && !q.isEssential) return false;
    return true;
  });

  // Group by type for section headers
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (chapters.length === 0) {
    return <div className="text-center py-12 text-sm text-muted-foreground">문항 데이터가 없습니다.</div>;
  }

  return (
    <div className="space-y-3">
      {/* Chapter tabs */}
      <ChapterTabs
        chapters={chapters}
        selectedId={selectedChapterId}
        onSelect={setSelectedChapterId}
      />

      {/* Section filter pills */}
      <div className="flex items-center gap-1.5">
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
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => setEssentialOnly((v) => !v)}
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

      {/* Spreadsheet table */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted-foreground">해당 유형의 문항이 없습니다.</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted/60">
                  <th className="sticky left-0 z-10 bg-muted/60 w-10 px-2 py-2 text-center font-semibold text-muted-foreground border-b border-r border-border">
                    #
                  </th>
                  <th className="sticky left-10 z-10 bg-muted/60 w-12 px-1 py-2 text-center font-semibold text-muted-foreground border-b border-r border-border">
                    유형
                  </th>
                  <th className="sticky left-[88px] z-10 bg-muted/60 min-w-[120px] px-2 py-2 text-left font-semibold text-muted-foreground border-b border-r border-border">
                    주제
                  </th>
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
                        <td
                          colSpan={3 + roundCount}
                          className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground bg-muted/30 border-b border-border uppercase tracking-wider"
                        >
                          {typeLabels[group.type]} ({group.rows.length})
                        </td>
                      </tr>
                    )}
                    {group.rows.map((q) => {
                      const globalIdx = questions.indexOf(q);
                      return (
                        <tr key={q.questionId} className="hover:bg-accent/20 transition-colors">
                          <td className="sticky left-0 z-10 bg-card w-10 px-2 py-0 text-center border-b border-r border-border">
                            <span className={cn(
                              "font-medium text-xs",
                              q.isEssential ? "text-primary font-bold" : "text-foreground"
                            )}>
                              {q.questionNumber}
                            </span>
                          </td>
                          <td className="sticky left-10 z-10 bg-card w-12 px-1 py-0 text-center border-b border-r border-border">
                            <span className="text-[9px] text-muted-foreground">
                              {q.questionType === "past_exam" && (
                                <span className="text-primary/70 font-semibold">
                                  {q.examYear ? `${q.examYear.slice(-2)}기출` : "기출"}
                                </span>
                              )}
                              {q.questionType === "practice" && <span className="font-semibold">실전</span>}
                              {q.questionType === "example" && <span className="font-semibold">예제</span>}
                            </span>
                          </td>
                          <td className="sticky left-[88px] z-10 bg-card min-w-[120px] px-2 py-0 text-left border-b border-r border-border">
                            <span className="text-[10px] text-muted-foreground truncate block max-w-[160px]">
                              {q.topic || "–"}
                            </span>
                          </td>
                          {q.rounds.map((round, rIdx) => (
                            <td key={rIdx} className="p-0 border-b border-r border-border last:border-r-0">
                              <ReviewCell
                                result={round.result}
                                date={round.date}
                                readOnly={readOnly}
                                onChange={(result) => handleCellChange(globalIdx, rIdx, result)}
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
    </div>
  );
}
