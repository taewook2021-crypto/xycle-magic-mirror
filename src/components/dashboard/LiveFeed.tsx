import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface BookFeedItem {
  bookTitle: string;
  myCount: number;
  avgCount: number;
  peers: PeerEntry[];
}

export interface PeerEntry {
  id: string;
  name: string;
  count: number;
  isMe?: boolean;
  isPublic?: boolean;
}

interface LiveFeedProps {
  books?: BookFeedItem[];
}

function PeerRow({ peer, rank }: { peer: PeerEntry; rank: number }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
        peer.isMe
          ? "bg-primary/5 font-semibold text-primary"
          : "text-foreground hover:bg-accent"
      )}
    >
      <span className="w-4 text-right tabular-nums text-muted-foreground text-[10px]">{rank}</span>
      <span className="flex-1 truncate">{peer.name}</span>
      <span className="tabular-nums font-medium">{peer.count}문제</span>
    </div>
  );
}

function BookSection({ book }: { book: BookFeedItem }) {
  const diff = book.myCount - book.avgCount;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{book.bookTitle}</span>
        <span
          className={cn(
            "text-[10px] font-bold",
            diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {diff > 0 ? `▲ 평균보다 ${diff}문제 더` : diff < 0 ? `▼ 평균보다 ${Math.abs(diff)}문제 적음` : "평균과 동일"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1">
        <span>나 {book.myCount}문제</span>
        <span>·</span>
        <span>평균 {book.avgCount}문제</span>
      </div>
      <div className="space-y-0.5">
        {book.peers.map((peer, i) => (
          <PeerRow key={peer.id} peer={peer} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

export default function LiveFeed({ books = [] }: LiveFeedProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">오늘의 동차생 풀이량</span>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        </div>
        {books.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">아직 학습 피드가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <BookSection key={book.bookTitle} book={book} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
