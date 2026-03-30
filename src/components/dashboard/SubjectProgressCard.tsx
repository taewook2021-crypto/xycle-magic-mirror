import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UserBookInfo, BookProgress } from "@/hooks/useDashboardData";
import type { PeerAvgInfo } from "@/hooks/usePeerAvgProgress";
import SwipeableBookItem from "./SwipeableBookItem";

const SUBJECT_COLORS = [
  "174 50% 50%", "217 91% 60%", "142 72% 40%", "270 67% 55%",
  "340 82% 60%", "45 93% 55%", "195 85% 55%", "0 72% 51%",
];

export function getSubjectColor(index: number) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

interface SortableBookItemProps {
  book: UserBookInfo;
  bp: BookProgress | undefined;
  color: string;
  peerAvg?: PeerAvgInfo;
  examStatus?: string | null;
  onDelete: (id: string) => void;
}

function SortableBookItem({ book, bp, color, peerAvg, examStatus, onDelete }: SortableBookItemProps) {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const total = bp?.totalQuestions || 0;
  const attempted = bp?.attempted || 0;
  const correct = bp?.correct || 0;
  const progress = total > 0 ? Math.round((attempted / total) * 100) : 0;
  const correctRate = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div ref={setNodeRef} style={style}>
      <SwipeableBookItem onDelete={() => onDelete(book.id)}>
        <div
          onClick={() => navigate(`/review/${book.bookId}`)}
          className="group/book w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors space-y-1.5 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{book.title}</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}
              className="hidden sm:flex p-1 opacity-0 group-hover/book:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
              title="삭제"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div
              {...attributes}
              {...listeners}
              className="touch-none p-1 -mr-1 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50" />
            </div>
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
            </p>
          )}
        </div>
      </SwipeableBookItem>
    </div>
  );
}

interface SubjectProgressCardProps {
  subjectId: string;
  name: string;
  colorIndex: number;
  userBooks: UserBookInfo[];
  bookProgress: BookProgress[];
  peerAvgMap?: Map<string, PeerAvgInfo>;
  examStatus?: string | null;
  onDeleteBook: (userBookId: string) => void;
}

export default function SubjectProgressCard({
  subjectId,
  name,
  colorIndex,
  userBooks,
  bookProgress,
  peerAvgMap,
  examStatus,
  onDeleteBook,
}: SubjectProgressCardProps) {
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

      {/* Books */}
      <div className="pl-7 pr-4 pb-2 space-y-1.5">
        {myBooks.length === 0 ? (
          <p className="text-xs text-muted-foreground py-1.5 pl-2">등록된 교재가 없습니다</p>
        ) : (
          myBooks.map((b) => (
            <SortableBookItem
              key={b.id}
              book={b}
              bp={bpMap.get(b.bookId)}
              color={color}
              peerAvg={peerAvgMap?.get(b.bookId)}
              examStatus={examStatus}
              onDelete={onDeleteBook}
            />
          ))
        )}
      </div>
    </div>
  );
}
