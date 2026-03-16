import { Card, CardContent } from "@/components/ui/card";
import { Flame, Target, BookOpen } from "lucide-react";

interface TodayStats {
  solved: number;
  accuracy: number;
  streak: number;
}

interface TodayStatsCardProps {
  stats?: TodayStats | null;
}

export default function TodayStatsCard({ stats }: TodayStatsCardProps) {
  const { solved = 0, accuracy = 0, streak = 0 } = stats ?? {};

  const items = [
    { icon: BookOpen, label: "오늘 풀이", value: `${solved}문제`, color: "text-primary" },
    { icon: Target, label: "정답률", value: `${accuracy}%`, color: "text-success" },
    { icon: Flame, label: "연속", value: `${streak}일`, color: "text-warning" },
  ];

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 divide-x divide-border">
          {items.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-lg font-bold text-foreground">{value}</span>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
