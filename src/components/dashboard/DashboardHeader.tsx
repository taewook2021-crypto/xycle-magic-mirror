

interface DashboardHeaderProps {
  dDay: number;
  todayAttempts: number;
}

const D_DAY_TARGET = new Date("2026-06-27");

export function getDDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((D_DAY_TARGET.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export const EXAM_LABEL = "2026 CPA 2차 · 6.27-28";

export default function DashboardHeader({ dDay, todayAttempts }: DashboardHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground px-5 pt-6 pb-8 rounded-b-2xl">
      {/* Top row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium tracking-tight opacity-70">
          {EXAM_LABEL}
        </span>
      </div>

      {/* D-day */}
      <div className="text-center mb-2">
        <p
          className="text-[52px] font-bold tracking-tight leading-none"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          D-{dDay}
        </p>
      </div>

      <div className="text-center">
        <p className="text-[11px] opacity-50 mb-0.5 tracking-wide">오늘 풀이</p>
        <p
          className="text-lg font-medium tracking-tight leading-none"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {todayAttempts.toLocaleString()}
          <span className="text-sm opacity-60 ml-1">문제</span>
        </p>
      </div>
    </div>
  );
}
