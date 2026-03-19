import { Play, Pause, MoreVertical, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StudySubject {
  id: string;
  name: string;
  color: string; // HSL string like "11 82% 54%"
  elapsed: number; // seconds
}

interface SubjectTimerProps {
  subject: StudySubject;
  isActive: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

function formatTime(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SubjectTimer({
  subject,
  isActive,
  onToggle,
  onDelete,
}: SubjectTimerProps) {
  const colorHsl = `hsl(${subject.color})`;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
        isActive ? "bg-accent/80" : "hover:bg-accent/40"
      )}
    >
      {/* Play/Pause button */}
      <button
        onClick={onToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shrink-0"
        style={{
          borderColor: colorHsl,
          backgroundColor: isActive ? colorHsl : "transparent",
        }}
      >
        {isActive ? (
          <Pause className="h-4 w-4 text-white" fill="white" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" style={{ color: colorHsl }} fill={colorHsl} />
        )}
      </button>

      {/* Subject name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{subject.name}</p>
      </div>

      {/* Elapsed time */}
      <span
        className="text-sm tabular-nums tracking-tight text-muted-foreground"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {formatTime(subject.elapsed)}
      </span>

      {/* More menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
