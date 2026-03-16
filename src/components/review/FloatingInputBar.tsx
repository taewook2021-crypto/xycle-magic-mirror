import { useIsMobile } from "@/hooks/use-mobile";
import type { CellResult } from "./ReviewCell";
import { cn } from "@/lib/utils";
import { X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface FloatingInputBarProps {
  visible: boolean;
  currentQuestion?: { number: number; round: number };
  onInput: (result: CellResult) => void;
  onClear: () => void;
  onClose: () => void;
  onNavigate: (direction: "up" | "down" | "left" | "right") => void;
}

const buttons: { result: CellResult; label: string; className: string; key: string }[] = [
  {
    result: "correct",
    label: "O",
    className: "bg-success/15 text-success border-success/30 hover:bg-success/25 active:bg-success/35",
    key: "1",
  },
  {
    result: "half",
    label: "△",
    className: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/25 active:bg-warning/35",
    key: "2",
  },
  {
    result: "wrong",
    label: "X",
    className: "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25 active:bg-destructive/35",
    key: "3",
  },
];

export default function FloatingInputBar({
  visible,
  currentQuestion,
  onInput,
  onClear,
  onClose,
  onNavigate,
}: FloatingInputBarProps) {
  const isMobile = useIsMobile();

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg",
        isMobile ? "bottom-14 inset-x-0 safe-area-bottom" : "bottom-0 inset-x-0"
      )}
    >
      <div className="max-w-4xl mx-auto px-3 py-2.5 flex items-center gap-2">
        {/* Current question indicator */}
        <div className="flex items-center gap-1.5 min-w-0 shrink-0">
          <span className="text-xs font-semibold text-foreground">
            #{currentQuestion?.number ?? "–"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {currentQuestion ? `${currentQuestion.round}회독` : ""}
          </span>
        </div>

        {/* Nav arrows - desktop only */}
        {!isMobile && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onNavigate("up")}
              className="p-1 rounded hover:bg-accent text-muted-foreground"
              title="↑ 위로"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate("down")}
              className="p-1 rounded hover:bg-accent text-muted-foreground"
              title="↓ 아래로"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate("left")}
              className="p-1 rounded hover:bg-accent text-muted-foreground"
              title="← 왼쪽"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate("right")}
              className="p-1 rounded hover:bg-accent text-muted-foreground"
              title="→ 오른쪽"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* O / △ / X buttons */}
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          {buttons.map((btn) => (
            <button
              key={btn.result}
              onClick={() => onInput(btn.result)}
              className={cn(
                "flex-1 max-w-[100px] h-10 rounded-lg border text-base font-bold transition-all active:scale-95 select-none touch-manipulation",
                btn.className
              )}
            >
              {btn.label}
              {!isMobile && (
                <span className="ml-1 text-[9px] font-normal opacity-60">{btn.key}</span>
              )}
            </button>
          ))}
        </div>

        {/* Clear + Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onClear}
            className="px-2 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground hover:bg-accent border border-border transition-colors"
          >
            지우기
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
