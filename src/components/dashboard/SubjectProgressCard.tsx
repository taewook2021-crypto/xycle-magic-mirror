import { Progress } from "@/components/ui/progress";

const SUBJECT_COLORS = [
  "174 50% 50%",   // 틸
  "217 91% 60%",  // 파랑
  "142 72% 40%",  // 초록
  "270 67% 55%",  // 보라
  "340 82% 60%",  // 분홍
  "45 93% 55%",   // 노랑
  "195 85% 55%",  // 하늘
  "0 72% 51%",    // 빨강
];

export function getSubjectColor(index: number) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

interface SubjectProgressCardProps {
  name: string;
  attempted: number;
  total: number;
  correctRate: number;
  colorIndex: number;
}

export default function SubjectProgressCard({
  name,
  attempted,
  total,
  correctRate,
  colorIndex,
}: SubjectProgressCardProps) {
  const color = getSubjectColor(colorIndex);
  const progress = total > 0 ? Math.round((attempted / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-accent/40 transition-all">
      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: `hsl(${color})` }}
      />

      {/* Name + progress */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground truncate">{name}</p>
          <span className="text-xs text-muted-foreground tabular-nums">
            {attempted}/{total}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-1.5"
          style={{
            // Override indicator color
            ["--progress-color" as string]: `hsl(${color})`,
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">진도 {progress}%</span>
          <span className="text-[11px] text-muted-foreground">정답률 {correctRate}%</span>
        </div>
      </div>
    </div>
  );
}
