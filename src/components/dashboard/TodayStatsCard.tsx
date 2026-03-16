import { Card, CardContent } from "@/components/ui/card";
import { Flame, Target, BookOpen } from "lucide-react";

const mockStats = {
  solved: 12,
  accuracy: 83,
  streak: 7,
};

export default function TodayStatsCard() {
  const { solved, accuracy, streak } = mockStats;

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
