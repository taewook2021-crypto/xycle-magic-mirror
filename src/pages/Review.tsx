import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import BookSelector from "@/components/review/BookSelector";
import ReviewGrid from "@/components/review/ReviewGrid";

interface Book {
  id: string;
  title: string;
  subject: string;
}

interface ReviewProps {
  books?: Book[];
}

export default function Review({ books = [] }: ReviewProps) {
  const [selectedBook, setSelectedBook] = useState<string | null>(books[0]?.id ?? null);

  return (
    <AppShell>
      <div className="px-4 pt-5 space-y-4">
        <h1 className="text-lg font-bold text-foreground">회독표</h1>
        {books.length > 0 ? (
          <>
            <BookSelector books={books} selectedId={selectedBook ?? ""} onSelect={setSelectedBook} />
            <ReviewGrid />
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">등록된 교재가 없습니다.</p>
        )}
      </div>
    </AppShell>
  );
}
