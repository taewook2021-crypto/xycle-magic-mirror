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

const buttons: { result: CellResult; label: string; color: string; key: string }[] = [
  { result: "correct", label: "O", color: "#22c55e", key: "1" },
  { result: "half", label: "△", color: "#f59e0b", key: "2" },
  { result: "wrong", label: "X", color: "#ef4444", key: "3" },
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
        "fixed z-50 px-4",
        isMobile ? "bottom-16 inset-x-0 safe-area-bottom" : "bottom-4 inset-x-0"
      )}
    >
      <div
        className="max-w-3xl mx-auto flex items-center gap-3 px-5 h-14 rounded-full"
        style={{
          background: "hsl(0 0% 100% / 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid hsl(0 0% 0% / 0.06)",
          boxShadow: "0 4px 20px hsl(0 0% 0% / 0.08)",
        }}
      >
        {/* Current question indicator */}
        <div className="flex items-center gap-1.5 min-w-0 shrink-0">
          <span className="text-sm font-bold text-foreground">
            #{currentQuestion?.number ?? "–"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {currentQuestion ? `${currentQuestion.round}회독` : ""}
          </span>
        </div>

        {/* Nav arrows - desktop only */}
        {!isMobile && (
          <div className="flex items-center gap-0.5 shrink-0">
            {[
              { dir: "up" as const, icon: ChevronUp, title: "↑ 위로" },
              { dir: "down" as const, icon: ChevronDown, title: "↓ 아래로" },
              { dir: "left" as const, icon: ChevronLeft, title: "← 왼쪽" },
              { dir: "right" as const, icon: ChevronRight, title: "→ 오른쪽" },
            ].map(({ dir, icon: Icon, title }) => (
              <button
                key={dir}
                onClick={() => onNavigate(dir)}
                className="p-1.5 rounded-lg hover:bg-[#f4f4f5] text-muted-foreground transition-colors"
                title={title}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        {/* O / △ / X buttons */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          {buttons.map((btn) => (
            <button
              key={btn.result}
              onClick={() => onInput(btn.result)}
              className="flex-1 max-w-[100px] h-10 rounded-xl text-base font-bold transition-all active:scale-95 select-none touch-manipulation"
              style={{
                background: `${btn.color}10`,
                color: btn.color,
                border: `1.5px solid ${btn.color}30`,
              }}
            >
              {btn.label}
              {!isMobile && (
                <span className="ml-1 text-[9px] font-normal opacity-50">{btn.key}</span>
              )}
            </button>
          ))}
        </div>

        {/* Clear + Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-[#f4f4f5] border border-[hsl(0,0%,0%,0.1)] transition-colors"
          >
            지우기
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-[#f4f4f5] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
