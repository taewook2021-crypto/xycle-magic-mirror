import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Mock data
const mockData = {
  percentile: 23,
  myCount: 42,
  avgCount: 28,
  weekLabel: "이번 주",
};

const barMax = 50;

export default function PeerComparisonCard() {
  const { percentile, myCount, avgCount, weekLabel } = mockData;

  return (
    <Card className="border-none shadow-md bg-primary text-primary-foreground overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium opacity-80">{weekLabel} 풀이량</p>
            <p className="text-2xl font-bold mt-0.5">
              상위 {percentile}%
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2.5">
          {/* My bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">나</span>
              <span className="font-bold">{myCount}문제</span>
            </div>
            <div className="h-2.5 rounded-full bg-primary-foreground/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-foreground transition-all duration-700"
                style={{ width: `${(myCount / barMax) * 100}%` }}
              />
            </div>
          </div>

          {/* Avg bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs opacity-70">
              <span>동차생 평균</span>
              <span>{avgCount}문제</span>
            </div>
            <div className="h-2.5 rounded-full bg-primary-foreground/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-foreground/50 transition-all duration-700"
                style={{ width: `${(avgCount / barMax) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
