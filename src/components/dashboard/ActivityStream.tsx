import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  userName: string;
  bookTitle: string;
  chapterTitle?: string;
  questionCount?: number;
  minutesAgo: number;
  isLive: boolean;
}

interface ActivityStreamProps {
  activities: ActivityItem[];
  onUserClick?: (userName: string, userId: string) => void;
}

export default function ActivityStream({ activities, onUserClick }: ActivityStreamProps) {
  const liveUsers = activities.filter((a) => a.isLive);
  const recentDone = activities.filter((a) => !a.isLive);

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Live header */}
        {liveUsers.length > 0 && (
          <div className="px-4 py-2.5 bg-success/5 border-b border-success/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </div>
              <span className="text-[11px] font-semibold text-success">지금 공부 중</span>
              <span className="text-[10px] text-muted-foreground">{liveUsers.length}명</span>
            </div>
            <div className="space-y-1">
              {liveUsers.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => onUserClick?.(a.userName, a.id)}
                    className="font-medium text-foreground hover:text-primary transition-colors truncate"
                  >
                    {a.userName}
                  </button>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-muted-foreground truncate flex-1">{a.bookTitle} 풀이 중</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.minutesAgo}분 전</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent completions */}
        <div className="px-4 py-3">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">최근 활동</span>
          <div className="mt-2 space-y-2">
            {recentDone.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">아직 활동이 없습니다.</p>
            ) : (
              recentDone.map((a) => (
                <div key={a.id} className="flex items-start gap-2 text-xs">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span>
                      <button
                        onClick={() => onUserClick?.(a.userName, a.id)}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {a.userName}
                      </button>
                      <span className="text-muted-foreground">
                        이 {a.bookTitle}
                        {a.questionCount && <span className="font-semibold text-foreground"> {a.questionCount}문제</span>}
                        {" "}완료
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{a.minutesAgo}분 전</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
