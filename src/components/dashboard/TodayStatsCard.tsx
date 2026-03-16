import { Card } from "@/components/ui/card";
import { PenLine, BarChart3, Flame, TrendingUp } from "lucide-react";

interface StatsData {
  todaySolved: number;
  weeklySolved: number;
  streak: number;
  accuracyTrend: number;
}

interface TodayStatsCardProps {
  stats?: StatsData | null;
}

const items = [
  { key: "todaySolved", label: "오늘 풀이", suffix: "문제", icon: PenLine },
  { key: "weeklySolved", label: "이번 주", suffix: "문제", icon: BarChart3 },
  { key: "streak", label: "연속 학습", suffix: "일", icon: Flame },
  { key: "accuracyTrend", label: "정답률 추이", prefix: "↑ ", suffix: "%p", icon: TrendingUp },
] as const;

export default function TodayStatsCard({ stats }: TodayStatsCardProps) {
  const data = stats ?? { todaySolved: 0, weeklySolved: 0, streak: 0, accuracyTrend: 0 };

  return (
    <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden border border-border bg-border">
      {items.map(({ key, label, suffix, prefix, icon: Icon }) => (
        <div key={key} className="p-3 bg-card">
          <div className="flex items-center gap-1 mb-0.5">
            <Icon className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
          </div>
          <div className="text-base font-bold text-foreground">
            {prefix}{data[key]}
            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{suffix}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
