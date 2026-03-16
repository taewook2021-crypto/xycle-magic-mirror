import { cn } from "@/lib/utils";

export type CellResult = "correct" | "wrong" | "half" | null;

interface ReviewCellProps {
  result: CellResult;
  date?: string;
  readOnly?: boolean;
  isActive?: boolean;
  onChange: (result: CellResult) => void;
  onSelect?: () => void;
}

const resultStyles: Record<string, { label: string; bg: string; text: string }> = {
  correct: { label: "O", bg: "bg-success/20", text: "text-success" },
  wrong: { label: "X", bg: "bg-destructive/20", text: "text-destructive" },
  half: { label: "△", bg: "bg-warning/20", text: "text-warning" },
};

export default function ReviewCell({ result, date, readOnly, isActive, onSelect }: ReviewCellProps) {
  const style = result ? resultStyles[result] : null;

  return (
    <button
      onClick={() => {
        if (!readOnly && onSelect) onSelect();
      }}
      className={cn(
        "w-full h-8 flex items-center justify-center text-xs font-semibold select-none touch-manipulation transition-all",
        style ? `${style.bg} ${style.text}` : "text-muted-foreground/20",
        !readOnly && "hover:bg-accent/40 cursor-pointer",
        readOnly && "cursor-default",
        isActive && "ring-2 ring-primary ring-inset bg-primary/10"
      )}
      title={date}
    >
      {style ? style.label : "–"}
    </button>
  );
}
