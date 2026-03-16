import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MemoPopoverProps {
  memo: string;
  onSave: (content: string) => void;
}

export default function MemoPopover({ memo, onSave }: MemoPopoverProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(memo);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMemo = memo.trim().length > 0;

  useEffect(() => {
    if (open) {
      setValue(memo);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open, memo]);

  const handleClose = () => {
    const trimmed = value.trim();
    if (trimmed !== memo.trim()) {
      onSave(trimmed);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "p-0.5 rounded transition-colors",
            hasMemo
              ? "text-primary hover:text-primary/80"
              : "text-muted-foreground/30 hover:text-muted-foreground/60"
          )}
          onClick={(e) => e.stopPropagation()}
          title={hasMemo ? memo : "메모 추가"}
        >
          <MessageSquare className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-2"
        side="right"
        align="start"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="w-full h-20 text-xs bg-transparent border border-border rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") handleClose();
          }}
        />
        <div className="flex justify-end mt-1.5 gap-1">
          {hasMemo && (
            <button
              onClick={() => { setValue(""); onSave(""); setOpen(false); }}
              className="text-[10px] px-2 py-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
            >
              삭제
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-[10px] px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            저장
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
