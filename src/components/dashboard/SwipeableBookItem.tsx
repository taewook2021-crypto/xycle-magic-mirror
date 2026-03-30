import { useRef, useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableBookItemProps {
  children: ReactNode;
  onDelete: () => void;
}

export default function SwipeableBookItem({ children, onDelete }: SwipeableBookItemProps) {
  const startX = useRef(0);
  const currentX = useRef(0);
  const [offset, setOffset] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const swiping = useRef(false);

  const THRESHOLD = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    swiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping.current) return;
    currentX.current = e.touches[0].clientX;
    const diff = startX.current - currentX.current;
    if (diff > 0) {
      setOffset(Math.min(diff, 80));
    } else {
      setOffset(0);
    }
  };

  const handleTouchEnd = () => {
    swiping.current = false;
    if (offset >= THRESHOLD) {
      setOffset(80);
      setShowDelete(true);
    } else {
      setOffset(0);
      setShowDelete(false);
    }
  };

  const handleClose = () => {
    setOffset(0);
    setShowDelete(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete button behind */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-destructive"
        style={{ width: 80 }}
      >
        <button
          onClick={() => {
            onDelete();
            handleClose();
          }}
          className="flex flex-col items-center gap-0.5 text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-[10px] font-medium">삭제</span>
        </button>
      </div>

      {/* Main content */}
      <div
        className="relative bg-card transition-transform"
        style={{
          transform: `translateX(-${offset}px)`,
          transitionDuration: swiping.current ? "0ms" : "200ms",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={showDelete ? handleClose : undefined}
      >
        {children}
      </div>
    </div>
  );
}
