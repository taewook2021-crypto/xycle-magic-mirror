import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeedItem {
  id: string;
  name: string;
  count: number;
  emoji: string;
  isMe?: boolean;
}

interface LiveFeedProps {
  items?: FeedItem[];
}

const maxCount = 50;

function FeedRow({ item }: { item: FeedItem }) {
  const [reacted, setReacted] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors",
        item.isMe
          ? "bg-primary/5 border-primary/20"
          : "bg-card border-border hover:bg-accent"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{item.emoji}</span>
        <span
          className={cn(
            "text-xs font-semibold",
            item.isMe ? "text-primary" : "text-foreground"
          )}
        >
          {item.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn("h-1.5 rounded-full transition-all duration-500", item.isMe ? "bg-primary" : "bg-border")}
          style={{ width: `${(item.count / maxCount) * 64}px` }}
        />
        <span
          className={cn(
            "text-[11px] font-bold tabular-nums min-w-[40px] text-right",
            item.isMe ? "text-primary" : "text-foreground"
          )}
        >
          {item.count}문제
        </span>
        <button
          onClick={() => setReacted(!reacted)}
          className={cn(
            "p-1 rounded-full transition-colors",
            reacted ? "text-primary" : "text-muted-foreground hover:text-primary/60"
          )}
        >
          <Flame className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function LiveFeed({ items = [] }: LiveFeedProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">오늘의 동차생 풀이량</span>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        </div>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">아직 학습 피드가 없습니다.</p>
        ) : (
          <div className="space-y-1.5">
            {items.map((item) => (
              <FeedRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
