import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import ReviewGrid from "@/components/review/ReviewGrid";
import AddBookSheet from "@/components/review/AddBookSheet";
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

interface ChapterInfo {
  id: string;
  title: string;
  number: number;
}

type ViewState =
  | { step: "books" }
  | { step: "chapters"; bookId: string; bookTitle: string }
  | { step: "grid"; bookId: string; bookTitle: string; chapterId: string; chapterTitle: string };

export default function Review() {
  const { user } = useAuth();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [view, setView] = useState<ViewState>({ step: "books" });

  // Available books for inline registration
  const [availableBooks, setAvailableBooks] = useState<{ id: string; title: string; author: string | null; subject_name: string }[]>([]);
  const [availableLoading, setAvailableLoading] = useState(false);

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
    setLoading(false);
  };

  const fetchAvailableBooks = async () => {
    setAvailableLoading(true);
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
    setAvailableLoading(false);
  };

  useEffect(() => {
    fetchUserBooks();
    fetchAvailableBooks();
  }, [user]);

  const fetchChapters = async (bookId: string) => {
    setChaptersLoading(true);
    const { data } = await supabase
      .from("chapters")
      .select("id, title, chapter_number")
      .eq("book_id", bookId)
      .order("display_order");
    if (data) {
      setChapters(data.map((c: any) => ({ id: c.id, title: c.title, number: c.chapter_number })));
    }
    setChaptersLoading(false);
  };

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
    await fetchUserBooks();
  };

  const openChapters = (book: UserBook) => {
    setView({ step: "chapters", bookId: book.book_id, bookTitle: book.title });
    fetchChapters(book.book_id);
  };

  const openGrid = (chapter: ChapterInfo) => {
    if (view.step !== "chapters") return;
    setView({
      step: "grid",
      bookId: view.bookId,
      bookTitle: view.bookTitle,
      chapterId: chapter.id,
      chapterTitle: `${chapter.number}. ${chapter.title}`,
    });
  };

  const goBack = () => {
    if (view.step === "grid") {
      setView({ step: "chapters", bookId: view.bookId, bookTitle: view.bookTitle });
    } else {
      setView({ step: "books" });
    }
  };

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
        {/* Header with back button */}
        <div className="flex items-center gap-2">
          {view.step !== "books" && (
            <button onClick={goBack} className="p-1 -ml-1 rounded-md hover:bg-accent transition-colors">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {view.step === "books" && "회독표"}
              {view.step === "chapters" && view.bookTitle}
              {view.step === "grid" && view.chapterTitle}
            </h1>
            {view.step === "grid" && (
              <p className="text-xs text-muted-foreground truncate">{view.bookTitle}</p>
            )}
          </div>
        </div>

        {/* Step 1: Book list */}
        {view.step === "books" && (
          <div className="space-y-5">
            {/* My books */}
            {userBooks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">내 교재</p>
                <div className="space-y-1.5">
                  {userBooks.map((book) => (
                    <button
                      key={book.book_id}
                      onClick={() => openChapters(book)}
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

            {/* Available books to register */}
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

        {/* Step 2: Chapter list */}
        {view.step === "chapters" && (
          <div className="space-y-1.5">
            {chaptersLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">챕터 데이터가 없습니다.</div>
            ) : (
              chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => openGrid(ch)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">{ch.number}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">{ch.title}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))
            )}

            {/* Remove book button with confirmation */}
            <RemoveBookButton onConfirm={() => { handleRemoveBook(view.bookId); setView({ step: "books" }); }} />
          </div>
        )}

        {/* Step 3: Review grid */}
        {view.step === "grid" && (
          <ReviewGridForChapter bookId={view.bookId} chapterId={view.chapterId} />
        )}
      </div>
    </AppShell>
  );
}

/** Thin wrapper that renders ReviewGrid for a single chapter */
function ReviewGridForChapter({ bookId, chapterId }: { bookId: string; chapterId: string }) {
  // We pass chapterId directly to a modified grid
  return <ReviewGrid bookId={bookId} initialChapterId={chapterId} singleChapter />;
}
