import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PeerProfileSheet, { type PeerProfile } from "./PeerProfileSheet";
import { type CellResult } from "@/components/review/ReviewCell";
import { type PeerBook } from "./PeerReviewSheet";

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
  streak?: number;
  weeklyCount?: number;
  books?: { title: string; progress: number; total: number }[];
}

interface LiveFeedProps {
  books?: BookFeedItem[];
  isMePublic?: boolean;
  onGoPublic?: () => void;
}

// Generate mock heatmap for demo
function mockHeatmap() {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), count: Math.floor(Math.random() * 30) });
  }
  return days;
}

function PeerRow({
  peer,
  rank,
  maxCount,
  onPeerClick,
}: {
  peer: PeerEntry;
  rank: number;
  maxCount: number;
  onPeerClick: (peer: PeerEntry) => void;
}) {
  const pct = maxCount > 0 ? Math.round((peer.count / maxCount) * 100) : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors",
        peer.isMe
          ? "bg-primary/5 ring-1 ring-primary/20"
          : "hover:bg-accent"
      )}
    >
      <span className="w-4 text-right tabular-nums text-muted-foreground text-[10px] font-bold">
        {rank === 1 ? "👑" : rank}
      </span>
      <button
        onClick={() => !peer.isMe && onPeerClick(peer)}
        disabled={peer.isMe}
        className={cn(
          "truncate text-left transition-colors",
          peer.isMe
            ? "font-semibold text-primary cursor-default"
            : "font-medium text-foreground hover:text-primary"
        )}
      >
        {peer.name}
      </button>
      <div className="flex-1 mx-1">
        <Progress value={pct} className="h-1.5" />
      </div>
      <span className={cn("tabular-nums font-bold whitespace-nowrap", peer.isMe ? "text-primary" : "text-foreground")}>
        {peer.count}
        <span className="font-normal text-muted-foreground">문제</span>
      </span>
      {peer.isMe && (
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 ml-0.5">
          상위 {Math.max(1, Math.round((rank / 10) * 100))}%
        </Badge>
      )}
    </div>
  );
}

function BookSection({
  book,
  onPeerClick,
}: {
  book: BookFeedItem;
  onPeerClick: (peer: PeerEntry) => void;
}) {
  const diff = book.myCount - book.avgCount;
  const maxCount = Math.max(...book.peers.map((p) => p.count), 1);

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
          {diff > 0 ? `▲ 평균+${diff}` : diff < 0 ? `▼ 평균${diff}` : "= 평균"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1">
        <span>나 <span className="font-semibold text-foreground">{book.myCount}</span>문제</span>
        <span>·</span>
        <span>동차생 평균 <span className="font-semibold text-foreground">{book.avgCount}</span>문제</span>
      </div>
      <div className="space-y-0.5">
        {book.peers.map((peer, i) => (
          <PeerRow key={peer.id} peer={peer} rank={i + 1} maxCount={maxCount} onPeerClick={onPeerClick} />
        ))}
      </div>
    </div>
  );
}

export default function LiveFeed({ books = [], isMePublic = false, onGoPublic }: LiveFeedProps) {
  const [selectedPeer, setSelectedPeer] = useState<PeerProfile | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const makeMockReviewBooks = (): PeerBook[] => {
    const results: CellResult[] = ["correct", "wrong", "half", null];
    return [
      {
        id: "rb1",
        title: "중급회계 연습서",
        chapters: [
          {
            chapterId: "rc1",
            chapterTitle: "Ch.1 재무보고",
            questions: Array.from({ length: 6 }, (_, i) => ({
              questionNumber: i + 1,
              rounds: [
                { result: results[Math.floor(Math.random() * 4)], date: "3/11" },
                { result: results[Math.floor(Math.random() * 4)] },
                { result: null },
              ],
            })),
          },
        ],
      },
      {
        id: "rb2",
        title: "세법개론",
        chapters: [
          {
            chapterId: "rc2",
            chapterTitle: "Ch.1 조세총론",
            questions: Array.from({ length: 5 }, (_, i) => ({
              questionNumber: i + 1,
              rounds: [
                { result: results[Math.floor(Math.random() * 3)], date: "3/9" },
                { result: null },
                { result: null },
              ],
            })),
          },
        ],
      },
    ];
  };

  const handlePeerClick = (peer: PeerEntry) => {
    setSelectedPeer({
      id: peer.id,
      name: peer.name,
      isPublic: peer.isPublic ?? true,
      todaySolved: peer.count,
      weeklySolved: peer.weeklyCount ?? peer.count * 5,
      streak: peer.streak ?? Math.floor(Math.random() * 15) + 1,
      books: peer.books ?? [
        { title: "중급회계 연습서", progress: 120, total: 300 },
        { title: "세법개론", progress: 80, total: 250 },
      ],
      heatmap: mockHeatmap(),
      reviewBooks: makeMockReviewBooks(),
    });
    setSheetOpen(true);
  };

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">오늘의 동차생 풀이량</span>
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
          {books.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">아직 학습 피드가 없습니다.</p>
          ) : (
            <div className="space-y-5">
              {books.map((book) => (
                <BookSection key={book.bookTitle} book={book} onPeerClick={handlePeerClick} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PeerProfileSheet
        peer={selectedPeer}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isMePublic={isMePublic}
        onGoPublic={onGoPublic}
      />
    </>
  );
}
