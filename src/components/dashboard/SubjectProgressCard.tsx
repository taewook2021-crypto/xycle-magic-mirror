import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen } from "lucide-react";
import type { UserBookInfo, BookProgress } from "@/hooks/useDashboardData";
import type { PeerAvgInfo } from "@/hooks/usePeerAvgProgress";

const SUBJECT_COLORS = [
  "174 50% 50%", "217 91% 60%", "142 72% 40%", "270 67% 55%",
  "340 82% 60%", "45 93% 55%", "195 85% 55%", "0 72% 51%",
];

export function getSubjectColor(index: number) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

interface SubjectProgressCardProps {
  subjectId: string;
  name: string;
  colorIndex: number;
  userBooks: UserBookInfo[];
  bookProgress: BookProgress[];
  peerAvgMap?: Map<string, PeerAvgInfo>;
  examStatus?: string | null;
}

export default function SubjectProgressCard({
  subjectId,
  name,
  colorIndex,
  userBooks,
  bookProgress,
  peerAvgMap,
  examStatus,
}: SubjectProgressCardProps) {
  const navigate = useNavigate();
  const color = getSubjectColor(colorIndex);

  const myBooks = userBooks.filter((b) => b.subjectId === subjectId);
  const bpMap = new Map(bookProgress.map((bp) => [bp.bookId, bp]));

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Subject header */}
      <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: `hsl(${color})` }}
        />
        <p className="text-sm font-semibold text-foreground">{name}</p>
      </div>

      {/* Books always visible */}
      <div className="pl-7 pr-4 pb-2 space-y-1.5">
        {myBooks.length === 0 ? (
          <p className="text-xs text-muted-foreground py-1.5 pl-2">등록된 교재가 없습니다</p>
        ) : (
          myBooks.map((b) => {
            const bp = bpMap.get(b.bookId);
            const total = bp?.totalQuestions || 0;
            const attempted = bp?.attempted || 0;
            const correct = bp?.correct || 0;
            const progress = total > 0 ? Math.round((attempted / total) * 100) : 0;
            const correctRate = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
            const peerAvg = peerAvgMap?.get(b.bookId);

            return (
              <button
                key={b.id}
                onClick={() => navigate(`/review/${b.bookId}`)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">{b.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
                <Progress
                  value={progress}
                  className="h-1.5"
                  style={{ ["--progress-color" as string]: `hsl(${color})` }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {attempted}/{total} · 진도 {progress}%
                  </span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    정답률 {correctRate}%
                  </span>
                </div>
                {peerAvg && examStatus && (
                  <p className="text-[10px] text-muted-foreground/70">
                    {examStatus} 평균: {peerAvg.avgRound}회독 · {peerAvg.avgChapterTitle}
                    <span className="ml-1 opacity-60">({peerAvg.peerCount}명)</span>
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
