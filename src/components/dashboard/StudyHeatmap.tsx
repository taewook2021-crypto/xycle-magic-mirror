import { cn } from "@/lib/utils";

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
}

interface StudyHeatmapProps {
  data: HeatmapDay[];
  days?: number;
}

function getIntensity(count: number, max: number): string {
  if (count === 0) return "bg-muted";
  const ratio = count / max;
  if (ratio <= 0.25) return "bg-success/20";
  if (ratio <= 0.5) return "bg-success/40";
  if (ratio <= 0.75) return "bg-success/70";
  return "bg-success";
}

export default function StudyHeatmap({ data, days = 30 }: StudyHeatmapProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;

  // Fill missing days
  const today = new Date();
  const allDays: HeatmapDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = data.find((x) => x.date === key);
    allDays.push(found ?? { date: key, count: 0 });
  }

  // 6 columns (weeks-ish), fill rows
  const cols = 6;
  const rows = Math.ceil(allDays.length / cols);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">최근 {days}일</span>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <span>{activeDays}일 학습</span>
          <span>·</span>
          <span>총 {total}문제</span>
        </div>
      </div>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {allDays.map((day) => (
          <div
            key={day.date}
            className={cn(
              "aspect-square rounded-[3px] transition-colors",
              getIntensity(day.count, max)
            )}
            title={`${day.date}: ${day.count}문제`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 justify-end">
        <span className="text-[9px] text-muted-foreground">적음</span>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <div
            key={i}
            className={cn(
              "h-2.5 w-2.5 rounded-[2px]",
              r === 0 ? "bg-muted" : r <= 0.25 ? "bg-success/20" : r <= 0.5 ? "bg-success/40" : r <= 0.75 ? "bg-success/70" : "bg-success"
            )}
          />
        ))}
        <span className="text-[9px] text-muted-foreground">많음</span>
      </div>
    </div>
  );
}
