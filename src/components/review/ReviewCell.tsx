import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export type CellResult = "correct" | "wrong" | "half" | null;

interface ReviewCellProps {
  result: CellResult;
  date?: string;
  readOnly?: boolean;
  onChange: (result: CellResult) => void;
}

const resultStyles: Record<string, { label: string; bg: string; text: string }> = {
  correct: { label: "O", bg: "bg-success/20", text: "text-success" },
  wrong: { label: "X", bg: "bg-destructive/20", text: "text-destructive" },
  half: { label: "△", bg: "bg-warning/20", text: "text-warning" },
};

const cycleOrder: CellResult[] = [null, "correct", "wrong", "half"];

export default function ReviewCell({ result, date, readOnly, onChange }: ReviewCellProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handleClick = useCallback(() => {
    if (readOnly || didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    const idx = cycleOrder.indexOf(result);
    onChange(cycleOrder[(idx + 1) % cycleOrder.length]);
  }, [result, readOnly, onChange]);

  const handlePointerDown = useCallback(() => {
    if (readOnly) return;
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onChange("half");
    }, 500);
  }, [readOnly, onChange]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const style = result ? resultStyles[result] : null;

  return (
    <button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "w-full h-8 flex items-center justify-center text-xs font-semibold select-none touch-manipulation transition-colors",
        style ? `${style.bg} ${style.text}` : "text-muted-foreground/20",
        !readOnly && "hover:bg-accent/40 active:scale-95 cursor-pointer",
        readOnly && "cursor-default"
      )}
      title={date}
    >
      {style ? style.label : "–"}
    </button>
  );
}
