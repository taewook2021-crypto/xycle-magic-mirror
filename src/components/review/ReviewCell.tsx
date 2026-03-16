import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export type CellResult = "correct" | "wrong" | "half" | null;

interface ReviewCellProps {
  result: CellResult;
  date?: string;
  realtimeMode: boolean;
  onChange: (result: CellResult) => void;
}

const resultDisplay: Record<string, { label: string; className: string }> = {
  correct: { label: "O", className: "bg-success/15 text-success border-success/30" },
  wrong: { label: "X", className: "bg-destructive/15 text-destructive border-destructive/30" },
  half: { label: "△", className: "bg-warning/15 text-warning border-warning/30" },
};

const cycleOrder: CellResult[] = ["correct", "wrong", null];

export default function ReviewCell({ result, date, realtimeMode, onChange }: ReviewCellProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handleClick = useCallback(() => {
    if (!realtimeMode || didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    // Cycle: null → correct → wrong → null
    const currentIndex = cycleOrder.indexOf(result);
    const next = cycleOrder[(currentIndex + 1) % cycleOrder.length];
    onChange(next);
  }, [result, realtimeMode, onChange]);

  const handlePointerDown = useCallback(() => {
    if (!realtimeMode) return;
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onChange("half");
    }, 500);
  }, [realtimeMode, onChange]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const display = result ? resultDisplay[result] : null;

  return (
    <button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "w-full h-full min-h-[44px] flex flex-col items-center justify-center rounded border text-xs font-semibold transition-all select-none touch-manipulation",
        display ? display.className : "bg-muted/30 border-border/50 text-muted-foreground/30",
        realtimeMode && "active:scale-95 cursor-pointer"
      )}
    >
      {display ? (
        <>
          <span className="text-sm leading-none">{display.label}</span>
          {date && <span className="text-[8px] font-normal opacity-60 mt-0.5">{date}</span>}
        </>
      ) : (
        <span className="text-[10px]">–</span>
      )}
    </button>
  );
}
