import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import ReviewGrid from "@/components/review/ReviewGrid";

interface PeerBook {
  id: string;
  title: string;
}

interface PeerReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  peerName: string;
  peerId: string;
  isMePublic: boolean;
  onGoPublic?: () => void;
}

export default function PeerReviewSheet({
  open,
  onOpenChange,
  peerName,
  peerId,
  isMePublic,
  onGoPublic,
}: PeerReviewSheetProps) {
  const [peerBooks, setPeerBooks] = useState<PeerBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !isMePublic || !peerId) return;
    setLoading(true);
    const fetch = async () => {
      const { data: userBooks } = await supabase
        .from("user_books")
        .select("book_id")
        .eq("user_id", peerId);
      if (!userBooks?.length) {
        setPeerBooks([]);
        setLoading(false);
        return;
      }
      const bookIds = userBooks.map((ub) => ub.book_id);
      const { data: books } = await supabase
        .from("books")
        .select("id, title")
        .in("id", bookIds)
        .order("display_order");
      const result = books ?? [];
      setPeerBooks(result);
      setSelectedBookId(result[0]?.id ?? "");
      setLoading(false);
    };
    fetch();
  }, [open, isMePublic, peerId]);

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
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : peerBooks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">등록된 교재가 없습니다.</p>
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
              {selectedBookId ? (
                <ReviewGrid
                  bookId={selectedBookId}
                  userId={peerId}
                  readOnly
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">교재를 선택하세요.</p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
