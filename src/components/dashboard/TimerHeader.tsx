import { BarChart3, CalendarDays } from "lucide-react";

interface TimerHeaderProps {
  dDay: number;
  totalSeconds: number;
}

function formatTime(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerHeader({ dDay, totalSeconds }: TimerHeaderProps) {
  return (
    <div className="bg-[hsl(0,0%,12%)] text-white px-5 pt-6 pb-8 rounded-b-2xl">
      {/* Top row */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold tracking-tight text-white/90">
          D-{dDay}
        </span>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors">
            <BarChart3 className="h-3.5 w-3.5" />
            통계
          </button>
          <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors">
            <CalendarDays className="h-3.5 w-3.5" />
            플래너
          </button>
        </div>
      </div>

      {/* Total time */}
      <div className="text-center">
        <p className="text-[11px] text-white/40 mb-1 tracking-wide">오늘의 공부시간</p>
        <p
          className="text-[42px] font-light tracking-[0.04em] leading-none"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {formatTime(totalSeconds)}
        </p>
      </div>
    </div>
  );
}
