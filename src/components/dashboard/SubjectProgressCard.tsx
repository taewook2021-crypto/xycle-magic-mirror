import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserBookInfo, AvailableBook } from "@/hooks/useDashboardData";

const SUBJECT_COLORS = [
  "174 50% 50%",
  "217 91% 60%",
  "142 72% 40%",
  "270 67% 55%",
  "340 82% 60%",
  "45 93% 55%",
  "195 85% 55%",
  "0 72% 51%",
];

export function getSubjectColor(index: number) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

interface SubjectProgressCardProps {
  subjectId: string;
  name: string;
  attempted: number;
  total: number;
  correctRate: number;
  colorIndex: number;
  userBooks: UserBookInfo[];
  availableBooks: AvailableBook[];
  onAddBook: (bookId: string) => Promise<void>;
}

export default function SubjectProgressCard({
  subjectId,
  name,
  attempted,
  total,
  correctRate,
  colorIndex,
  userBooks,
  availableBooks,
  onAddBook,
}: SubjectProgressCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const navigate = useNavigate();
  const color = getSubjectColor(colorIndex);
  const progress = total > 0 ? Math.round((attempted / total) * 100) : 0;

  const myBooks = userBooks.filter((b) => b.subjectId === subjectId);
  const myBookIds = new Set(myBooks.map((b) => b.bookId));
  const unregistered = availableBooks.filter(
    (b) => b.subjectId === subjectId && !myBookIds.has(b.id)
  );

  const handleAdd = async (bookId: string) => {
    setAdding(bookId);
    await onAddBook(bookId);
    setAdding(null);
  };

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Subject row — clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-accent/40 transition-all"
      >
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: `hsl(${color})` }}
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <span className="text-xs text-muted-foreground tabular-nums">
              {attempted}/{total}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-1.5"
            style={{ ["--progress-color" as string]: `hsl(${color})` }}
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">진도 {progress}%</span>
            <span className="text-[11px] text-muted-foreground">정답률 {correctRate}%</span>
          </div>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            expanded && "rotate-90"
          )}
        />
      </button>

      {/* Expanded: books list */}
      {expanded && (
        <div className="pl-10 pr-4 pb-3 space-y-1">
          {myBooks.length === 0 && unregistered.length === 0 && (
            <p className="text-xs text-muted-foreground py-2">등록 가능한 교재가 없습니다</p>
          )}

          {/* Registered books */}
          {myBooks.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/30"
            >
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{b.title}</span>
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            </div>
          ))}

          {/* Unregistered books */}
          {unregistered.map((b) => (
            <button
              key={b.id}
              onClick={() => handleAdd(b.id)}
              disabled={adding === b.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg w-full text-left hover:bg-accent/40 transition-colors disabled:opacity-50"
            >
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-sm text-muted-foreground truncate flex-1">{b.title}</span>
              {adding === b.id ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent shrink-0" />
              ) : (
                <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
