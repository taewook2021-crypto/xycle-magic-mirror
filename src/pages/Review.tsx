import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import ReviewGrid from "@/components/review/ReviewGrid";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, BookOpen, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserBook {
  id: string;
  book_id: string;
  title: string;
  author: string | null;
  subject_name: string;
}

export default function Review() {
  const { user } = useAuth();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Available books for inline registration
  const [availableBooks, setAvailableBooks] = useState<{ id: string; title: string; author: string | null; subject_name: string }[]>([]);

  const fetchUserBooks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_books")
      .select("id, book_id, books(title, author, subjects(name))")
      .eq("user_id", user.id)
      .order("created_at");

    if (error) {
      setLoading(false);
      return;
    }

    const mapped: UserBook[] = (data ?? []).map((ub: any) => ({
      id: ub.id,
      book_id: ub.book_id,
      title: ub.books?.title ?? "",
      author: ub.books?.author ?? null,
      subject_name: ub.books?.subjects?.name ?? "",
    }));

    setUserBooks(mapped);
    setLoading(false);
  };

  const fetchAvailableBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("id, title, author, subjects(name)")
      .order("display_order");
    if (data) {
      setAvailableBooks(
        data.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          subject_name: b.subjects?.name ?? "",
        }))
      );
    }
  };

  useEffect(() => {
    fetchUserBooks();
    fetchAvailableBooks();
  }, [user]);

  const handleAddBook = async (bookId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("user_books")
      .insert({ user_id: user.id, book_id: bookId });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "이미 등록된 교재입니다.", variant: "destructive" });
      } else {
        toast({ title: "등록 실패", description: error.message, variant: "destructive" });
      }
      return;
    }

    toast({ title: "교재가 등록되었습니다." });
    await fetchUserBooks();
    setSelectedBookId(bookId);
  };

  const handleRemoveBook = async (bookId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("user_books")
      .delete()
      .eq("user_id", user.id)
      .eq("book_id", bookId);

    if (error) {
      toast({ title: "삭제 실패", variant: "destructive" });
      return;
    }

    toast({ title: "교재가 삭제되었습니다." });
    if (selectedBookId === bookId) setSelectedBookId(null);
    await fetchUserBooks();
  };

  const selectedBook = userBooks.find((b) => b.book_id === selectedBookId);
  const registeredIds = new Set(userBooks.map((b) => b.book_id));
  const unregisteredBooks = availableBooks.filter((b) => !registeredIds.has(b.id));

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 pt-5 space-y-4 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          {selectedBookId && (
            <button onClick={() => setSelectedBookId(null)} className="p-1 -ml-1 rounded-md hover:bg-accent transition-colors">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">
            {selectedBook ? selectedBook.title : "회독표"}
          </h1>
        </div>

        {/* Book list view */}
        {!selectedBookId && (
          <div className="space-y-5">
            {userBooks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">내 교재</p>
                <div className="space-y-1.5">
                  {userBooks.map((book) => (
                    <button
                      key={book.book_id}
                      onClick={() => setSelectedBookId(book.book_id)}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {book.subject_name}{book.author ? ` · ${book.author}` : ""}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {unregisteredBooks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">교재 추가</p>
                <div className="space-y-1.5">
                  {unregisteredBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleAddBook(book.id)}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {book.subject_name}{book.author ? ` · ${book.author}` : ""}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {userBooks.length === 0 && unregisteredBooks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">등록 가능한 교재가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Review grid with chapter tabs (original tab style) */}
        {selectedBookId && (
          <>
            <ReviewGrid bookId={selectedBookId} />
            <RemoveBookButton onConfirm={() => handleRemoveBook(selectedBookId)} />
          </>
        )}
      </div>
    </AppShell>
  );
}

function RemoveBookButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="pt-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors mx-auto"
        >
          <Trash2 className="h-3 w-3" />
          교재 삭제
        </button>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">교재를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              삭제하면 이 교재의 회독 기록도 함께 사라집니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
