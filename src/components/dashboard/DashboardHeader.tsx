import { BarChart3, CalendarDays } from "lucide-react";

interface DashboardHeaderProps {
  dDay: number;
  totalAttempts: number;
}

const D_DAY_TARGET = new Date("2026-11-14");

export function getDDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((D_DAY_TARGET.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export default function DashboardHeader({ dDay, totalAttempts }: DashboardHeaderProps) {
  return (
    <div className="bg-[hsl(0,0%,12%)] text-white px-5 pt-6 pb-8 rounded-b-2xl">
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
