import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItem {
  id: string;
  examType: string;
  subject: string;
  book: string;
  chapter: string;
  count: number;
  accuracy: number;
  timeAgo: string;
  reactions: number;
}

const mockFeed: FeedItem[] = [
  { id: "1", examType: "동차생", subject: "재무회계", book: "김기동 연습서", chapter: "3단원", count: 8, accuracy: 87, timeAgo: "방금 전", reactions: 3 },
  { id: "2", examType: "재시생", subject: "원가회계", book: "임세진 연습서", chapter: "8장", count: 15, accuracy: 72, timeAgo: "5분 전", reactions: 7 },
  { id: "3", examType: "동차생", subject: "세법", book: "정우승 연습서", chapter: "2단원", count: 20, accuracy: 65, timeAgo: "12분 전", reactions: 2 },
  { id: "4", examType: "3유예", subject: "재무회계", book: "김기동 연습서", chapter: "7단원", count: 10, accuracy: 91, timeAgo: "23분 전", reactions: 12 },
  { id: "5", examType: "동차생", subject: "중급회계", book: "이효익 교과서", chapter: "5장", count: 6, accuracy: 78, timeAgo: "1시간 전", reactions: 1 },
];

function FeedCard({ item }: { item: FeedItem }) {
  const [reacted, setReacted] = useState(false);
  const [count, setCount] = useState(item.reactions);

  const handleReaction = () => {
    if (reacted) {
      setCount((c) => c - 1);
    } else {
      setCount((c) => c + 1);
    }
    setReacted(!reacted);
  };

  return (
    <Card className="border border-border shadow-none">
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                {item.examType}
              </span>
              <span className="text-[10px] text-muted-foreground">{item.timeAgo}</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {item.subject} · {item.book}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.chapter} · {item.count}문제
              <span className="inline-flex items-center ml-2 text-muted-foreground/50">
                <Lock className="h-3 w-3 mr-0.5" />
                <span className="blur-[4px] select-none">{item.accuracy}%</span>
              </span>
            </p>
          </div>

          <button
            onClick={handleReaction}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all border",
              reacted
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary border-border text-muted-foreground hover:bg-accent"
            )}
          >
            <Flame className="h-3.5 w-3.5" />
            <span className="font-medium">{count}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LiveFeed() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">실시간 학습 피드</h3>
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
      </div>
      <div className="space-y-2">
        {mockFeed.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
