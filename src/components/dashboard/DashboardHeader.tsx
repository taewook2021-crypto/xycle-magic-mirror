import { BarChart3, CalendarDays } from "lucide-react";

interface DashboardHeaderProps {
  dDay: number;
  totalAttempts: number;
}

const D_DAY_TARGET = new Date("2026-06-27");

export function getDDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((D_DAY_TARGET.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export const EXAM_LABEL = "2026 CPA 2차 · 6.27-28";

export default function DashboardHeader({ dDay, totalAttempts }: DashboardHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground px-5 pt-6 pb-8 rounded-b-2xl">
      {/* Top row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium tracking-tight opacity-70">
          {EXAM_LABEL}
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

      <div className="text-center">
        <p className="text-[11px] text-white/40 mb-1 tracking-wide">총 풀이</p>
        <p
          className="text-[42px] font-light tracking-[0.04em] leading-none"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {totalAttempts.toLocaleString()}
          <span className="text-lg text-white/50 ml-1">문제</span>
        </p>
      </div>
    </div>
  );
}
