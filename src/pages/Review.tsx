import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import ReviewGrid from "@/components/review/ReviewGrid";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";

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
  const [availableBooks, setAvailableBooks] = useState<{ id: string; title: string; author: string | null; subject_name: string }[]>([]);

  const fetchUserBooks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_books")
      .select("id, book_id, books(title, author, subjects(name))")
      .eq("user_id", user.id)
      .order("created_at");

    if (error) { setLoading(false); return; }

    setUserBooks((data ?? []).map((ub: any) => ({
      id: ub.id,
      book_id: ub.book_id,
      title: ub.books?.title ?? "",
      author: ub.books?.author ?? null,
      subject_name: ub.books?.subjects?.name ?? "",
    })));
    setLoading(false);
  };

  const fetchAvailableBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("id, title, author, subjects(name)")
      .order("display_order");
    if (data) {
      setAvailableBooks(data.map((b: any) => ({
        id: b.id, title: b.title, author: b.author,
        subject_name: b.subjects?.name ?? "",
      })));
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
        toast({ title: "등록 실패", variant: "destructive" });
      }
      return;
    }
    toast({ title: "교재가 등록되었습니다." });
    await fetchUserBooks();
    setSelectedBookId(bookId);
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
      <div className="px-4 pt-5 space-y-3 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 min-h-[28px]">
          {selectedBookId && (
            <button onClick={() => setSelectedBookId(null)} className="p-0.5 -ml-1 rounded hover:bg-accent transition-colors">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <h1 className={cn(
            "font-semibold text-foreground truncate",
            selectedBookId ? "text-sm" : "text-base"
          )}>
            {selectedBook ? selectedBook.title : "회독표"}
          </h1>
        </div>

        {/* Notion-style book list */}
        {!selectedBookId && (
          <div className="space-y-px">
            {userBooks.map((book) => (
              <button
                key={book.book_id}
                onClick={() => setSelectedBookId(book.book_id)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] hover:bg-accent/60 transition-colors text-left group"
              >
                <FileText className="h-[18px] w-[18px] text-muted-foreground/60 flex-shrink-0" />
                <span className="text-sm text-foreground flex-1 min-w-0 truncate">{book.title}</span>
                <span className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {book.subject_name}
                </span>
              </button>
            ))}

            {unregisteredBooks.length > 0 && (
              <>
                {userBooks.length > 0 && <div className="h-px bg-border my-2" />}
                {unregisteredBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleAddBook(book.id)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] hover:bg-accent/60 transition-colors text-left group"
                  >
                    <Plus className="h-[18px] w-[18px] text-muted-foreground/40 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground flex-1 min-w-0 truncate">{book.title}</span>
                    <span className="text-[11px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {book.subject_name}
                    </span>
                  </button>
                ))}
              </>
            )}

            {userBooks.length === 0 && unregisteredBooks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">등록 가능한 교재가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Review grid */}
        {selectedBookId && <ReviewGrid bookId={selectedBookId} />}
      </div>
    </AppShell>
  );
}
