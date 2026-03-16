import { Card, CardContent } from "@/components/ui/card";

interface WeekDay {
  day: string;
  me: number;
  avg: number;
}

interface PeerComparisonCardProps {
  weekData?: WeekDay[];
}

const maxVal = 45;

export default function PeerComparisonCard({ weekData = [] }: PeerComparisonCardProps) {
  if (weekData.length === 0) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground text-center py-4">
            문제를 풀면 주간 비교 차트가 나타납니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">주간 풀이량</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-foreground" />
              <span className="text-[9px] text-muted-foreground">나</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-border" />
              <span className="text-[9px] text-muted-foreground">동차생 평균</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1.5" style={{ height: 64 }}>
          {weekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-px" style={{ height: 52 }}>
                <div
                  className="flex-1 rounded-t-sm bg-foreground transition-all duration-500"
                  style={{ height: `${(d.me / maxVal) * 100}%` }}
                />
                <div
                  className="flex-1 rounded-t-sm bg-border transition-all duration-500"
                  style={{ height: `${(d.avg / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-[8px] font-medium text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
