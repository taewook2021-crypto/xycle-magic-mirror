import { useState, useCallback } from "react";
import ReviewCell, { type CellResult } from "./ReviewCell";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ChapterData {
  chapterId: string;
  chapterTitle: string;
  questions: {
    questionNumber: number;
    rounds: { result: CellResult; date?: string }[];
  }[];
}

// Mock data
const mockRounds = 3;
const mockChapters: ChapterData[] = [
  {
    chapterId: "1",
    chapterTitle: "Ch.1 재무보고 개념체계",
    questions: Array.from({ length: 8 }, (_, i) => ({
      questionNumber: i + 1,
      rounds: [
        { result: (["correct", "wrong", "half", "correct", "correct", "wrong", "half", "correct"] as CellResult[])[i], date: "3/15" },
        { result: i < 5 ? (["correct", "correct", "half", "correct", "correct"] as CellResult[])[i] : null, date: i < 5 ? "3/18" : undefined },
        { result: null },
      ],
    })),
  },
  {
    chapterId: "2",
    chapterTitle: "Ch.2 재고자산",
    questions: Array.from({ length: 10 }, (_, i) => ({
      questionNumber: i + 1,
      rounds: [
        { result: (["correct", "wrong", "correct", "wrong", "half", "correct", "correct", "wrong", "correct", "half"] as CellResult[])[i], date: "3/12" },
        { result: i < 7 ? (["correct", "half", "correct", "correct", "correct", "wrong", "correct"] as CellResult[])[i] : null, date: i < 7 ? "3/16" : undefined },
        { result: null },
      ],
    })),
  },
  {
    chapterId: "3",
    chapterTitle: "Ch.3 유형자산",
    questions: Array.from({ length: 6 }, (_, i) => ({
      questionNumber: i + 1,
      rounds: [
        { result: (["wrong", "half", "wrong", "correct", "wrong", "half"] as CellResult[])[i], date: "3/14" },
        { result: null },
        { result: null },
      ],
    })),
  },
];

type ColorFilter = "all" | "correct" | "wrong" | "half";

export default function ReviewGrid() {
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [colorFilter, setColorFilter] = useState<ColorFilter>("all");
  const [data, setData] = useState(mockChapters);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(["1"]));

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
      setData((prev) => {
        const next = [...prev];
        const chapter = { ...next[chapterIdx] };
        const questions = [...chapter.questions];
        const q = { ...questions[qIdx] };
        const rounds = [...q.rounds];
        rounds[roundIdx] = { ...rounds[roundIdx], result, date: result ? new Date().toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) : undefined };
        q.rounds = rounds;
        questions[qIdx] = q;
        chapter.questions = questions;
        next[chapterIdx] = chapter;
        return next;
      });
    },
    []
  );

  const filters: { key: ColorFilter; label: string; className: string }[] = [
    { key: "all", label: "전체", className: "" },
    { key: "wrong", label: "X만", className: "text-destructive" },
    { key: "half", label: "△만", className: "text-warning" },
    { key: "correct", label: "O만", className: "text-success" },
  ];

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setColorFilter(f.key)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border",
                colorFilter === f.key
                  ? "bg-foreground text-background border-foreground"
                  : `bg-secondary border-border ${f.className || "text-secondary-foreground"} hover:bg-accent`
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">실시간</span>
          <Switch checked={realtimeMode} onCheckedChange={setRealtimeMode} className="scale-75" />
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-2">
        {data.map((chapter, chapterIdx) => {
          const expanded = expandedChapters.has(chapter.chapterId);
          // Stats
          const allResults = chapter.questions.flatMap((q) => q.rounds.map((r) => r.result)).filter(Boolean);
          const correctCount = allResults.filter((r) => r === "correct").length;
          const totalCount = allResults.length;

          return (
            <div key={chapter.chapterId} className="rounded-lg border border-border overflow-hidden bg-card">
              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.chapterId)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-accent/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{chapter.chapterTitle}</span>
                <div className="flex items-center gap-2">
                  {totalCount > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round((correctCount / totalCount) * 100)}%
                    </span>
                  )}
                  <span className={cn("text-xs transition-transform", expanded && "rotate-90")}>▶</span>
                </div>
              </button>

              {/* Questions grid */}
              {expanded && (
                <div className="border-t border-border">
                  {/* Header row */}
                  <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `56px repeat(${mockRounds}, 1fr)` }}>
                    <div className="bg-muted px-2 py-1.5 text-[10px] font-medium text-muted-foreground text-center">
                      문항
                    </div>
                    {Array.from({ length: mockRounds }, (_, i) => (
                      <div key={i} className="bg-muted px-2 py-1.5 text-[10px] font-medium text-muted-foreground text-center">
                        {i + 1}회독
                      </div>
                    ))}
                  </div>

                  {/* Data rows */}
                  {chapter.questions
                    .filter((q) => {
                      if (colorFilter === "all") return true;
                      return q.rounds.some((r) => r.result === colorFilter);
                    })
                    .map((q, qIdx) => {
                      const originalIdx = chapter.questions.indexOf(q);
                      return (
                        <div
                          key={q.questionNumber}
                          className="grid gap-px bg-border"
                          style={{ gridTemplateColumns: `56px repeat(${mockRounds}, 1fr)` }}
                        >
                          <div className="bg-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                            Q{q.questionNumber}
                          </div>
                          {q.rounds.map((round, roundIdx) => (
                            <div key={roundIdx} className="bg-card p-0.5">
                              <ReviewCell
                                result={round.result}
                                date={round.date}
                                realtimeMode={realtimeMode}
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
