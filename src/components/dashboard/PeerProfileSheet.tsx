import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";
import StudyHeatmap, { type HeatmapDay } from "./StudyHeatmap";
import PeerReviewSheet from "./PeerReviewSheet";
import { cn } from "@/lib/utils";

export interface PeerProfile {
  id: string;
  name: string;
  isPublic: boolean;
  todaySolved: number;
  weeklySolved: number;
  streak: number;
  books: { title: string; progress: number; total: number }[];
  heatmap: HeatmapDay[];
}

interface PeerProfileSheetProps {
  peer: PeerProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewReview?: (peerId: string) => void;
  isMePublic: boolean;
  onGoPublic?: () => void;
}

export default function PeerProfileSheet({
  peer,
  open,
  onOpenChange,
  onViewReview,
  isMePublic,
  onGoPublic,
}: PeerProfileSheetProps) {
  const [reviewOpen, setReviewOpen] = useState(false);

  if (!peer) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-5 pb-8">
          <SheetHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {peer.name.charAt(0)}
              </div>
              <div>
                <SheetTitle className="text-base">{peer.name}</SheetTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {peer.isPublic ? (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">공개</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">비공개</Badge>
                  )}
                  {peer.streak > 0 && (
                    <span className="text-[10px] text-primary font-medium">🔥 {peer.streak}일 연속</span>
                  )}
                </div>
              </div>
            </div>
          </SheetHeader>

          {!peer.isPublic ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "오늘", value: `${peer.todaySolved}문제` },
                  { label: "이번 주", value: `${peer.weeklySolved}문제` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">이 수험생은 프로필을 비공개로 설정했습니다.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "오늘", value: `${peer.todaySolved}문제` },
                  { label: "이번 주", value: `${peer.weeklySolved}문제` },
                  { label: "연속 학습", value: `${peer.streak}일` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Book progress */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-foreground">교재별 진도</span>
                {peer.books.map((book) => {
                  const pct = Math.round((book.progress / book.total) * 100);
                  return (
                    <div key={book.title} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground truncate">{book.title}</span>
                        <span className="text-[10px] text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>

              {/* Heatmap */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-foreground">학습 히트맵</span>
                <StudyHeatmap data={peer.heatmap} />
              </div>

              {/* View review button */}
              <Button
                onClick={() => {
                  if (isMePublic) {
                    setReviewOpen(true);
                  }
                }}
                variant="outline"
                className="w-full"
                disabled={!isMePublic}
              >
                {isMePublic ? (
                  "회독표 보기"
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    내 회독표를 공개하면 열람 가능
                  </span>
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Peer review grid sheet */}
      <PeerReviewSheet
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        peerName={peer.name}
        peerBooks={peer.reviewBooks ?? []}
        isMePublic={isMePublic}
        onGoPublic={onGoPublic}
      />
    </>
  );
}
