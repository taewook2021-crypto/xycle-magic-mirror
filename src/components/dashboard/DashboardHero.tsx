import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardHeroProps {
  displayName: string;
  todaySolved: number;
  streak: number;
  avgDiff: number;
}

export default function DashboardHero({ displayName, todaySolved, streak, avgDiff }: DashboardHeroProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">오늘의 풀이</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1">
            <Flame className="h-3 w-3" />
            연속 {streak}일째
          </span>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tabular-nums text-foreground">{todaySolved}</span>
            <span className="text-sm font-medium text-muted-foreground">문제</span>
          </div>
          {avgDiff > 0 && (
            <span className="text-xs font-bold text-success">
              ▲ 동차생 평균보다 {avgDiff}문제 더
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
