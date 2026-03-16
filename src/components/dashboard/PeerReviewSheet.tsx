import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CellResult } from "@/components/review/ReviewCell";

export interface PeerChapter {
  chapterId: string;
  chapterTitle: string;
  questions: {
    questionNumber: number;
    rounds: { result: CellResult; date?: string }[];
  }[];
}

export interface PeerBook {
  id: string;
  title: string;
  chapters: PeerChapter[];
}

interface PeerReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  peerName: string;
  peerBooks: PeerBook[];
  isMePublic: boolean;
  onGoPublic?: () => void;
}

export default function PeerReviewSheet({
  open,
  onOpenChange,
  peerName,
  peerBooks,
  isMePublic,
  onGoPublic,
}: PeerReviewSheetProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>(peerBooks[0]?.id ?? "");
  const selectedBook = peerBooks.find((b) => b.id === selectedBookId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl h-[92vh] flex flex-col px-4 pb-6">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-base">{peerName}의 회독표</SheetTitle>
        </SheetHeader>

        {!isMePublic ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">내 회독표를 공개하면</p>
              <p className="text-sm font-medium text-foreground">다른 수험생의 회독표를 열람할 수 있습니다</p>
              <p className="text-xs text-muted-foreground mt-1.5">공개 전환은 언제든 취소할 수 있어요</p>
            </div>
            <Button onClick={onGoPublic} className="mt-2">
              공개로 전환하기
            </Button>
          </div>
        ) : (
          <>
            {peerBooks.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {peerBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBookId(book.id)}
                    className={cn(
                      "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      selectedBookId === book.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
                    )}
                  >
                    {book.title}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {selectedBook ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  동차생 회독표 열람 기능 준비 중
                </p>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">교재 데이터가 없습니다.</p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
