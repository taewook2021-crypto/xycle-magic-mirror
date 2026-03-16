import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Check } from "lucide-react";

interface AvailableBook {
  id: string;
  title: string;
  author: string | null;
  subject_name: string;
}

interface AddBookSheetProps {
  existingBookIds: string[];
  onAdd: (bookId: string) => Promise<void>;
}

export default function AddBookSheet({ existingBookIds, onAdd }: AddBookSheetProps) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<AvailableBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, subjects(name)")
        .order("display_order");

      if (!error && data) {
        setBooks(
          data.map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            subject_name: b.subjects?.name ?? "",
          }))
        );
      }
      setLoading(false);
    };

    fetchBooks();
  }, [open]);

  const handleAdd = async (bookId: string) => {
    setAdding(bookId);
    await onAdd(bookId);
    setAdding(null);
  };

  const isAdded = (bookId: string) => existingBookIds.includes(bookId);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[70vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-base">교재 추가</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              등록 가능한 교재가 없습니다.
            </p>
          ) : (
            books.map((book) => {
              const added = isAdded(book.id);
              return (
                <button
                  key={book.id}
                  onClick={() => !added && handleAdd(book.id)}
                  disabled={added || adding === book.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-accent/50 transition-colors disabled:opacity-60 disabled:cursor-default text-left"
                >
                  <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {added ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {book.subject_name}{book.author ? ` · ${book.author}` : ""}
                    </p>
                  </div>
                  {!added && (
                    <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  {adding === book.id && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
