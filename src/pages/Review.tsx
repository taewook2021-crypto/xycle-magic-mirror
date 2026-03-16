import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import BookSelector from "@/components/review/BookSelector";
import ReviewGrid from "@/components/review/ReviewGrid";
import AddBookSheet from "@/components/review/AddBookSheet";
import { toast } from "@/hooks/use-toast";

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
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserBooks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_books")
      .select("id, book_id, books(title, author, subjects(name))")
      .eq("user_id", user.id)
      .order("created_at");

    if (error) {
      console.error("Failed to fetch user books:", error);
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
    if (mapped.length > 0 && !selectedBookId) {
      setSelectedBookId(mapped[0].book_id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserBooks();
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
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">회독표</h1>
          <AddBookSheet
            existingBookIds={userBooks.map((b) => b.book_id)}
            onAdd={handleAddBook}
          />
        </div>

        {userBooks.length > 0 ? (
          <>
            <BookSelector
              books={userBooks.map((b) => ({ id: b.book_id, title: b.title, subject: b.subject_name }))}
              selectedId={selectedBookId ?? ""}
              onSelect={setSelectedBookId}
              onRemove={handleRemoveBook}
            />
            {selectedBookId && <ReviewGrid bookId={selectedBookId} />}
          </>
        ) : (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm text-muted-foreground">등록된 교재가 없습니다.</p>
            <p className="text-xs text-muted-foreground">
              오른쪽 상단의 + 버튼으로 교재를 추가해보세요.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
