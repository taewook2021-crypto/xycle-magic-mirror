import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import BookSelector from "@/components/review/BookSelector";
import ReviewGrid from "@/components/review/ReviewGrid";

const mockBooks = [
  { id: "1", title: "김기동 연습서", subject: "재무회계" },
  { id: "2", title: "임세진 연습서", subject: "원가회계" },
  { id: "3", title: "정우승 연습서", subject: "세법" },
];

export default function Review() {
  const [selectedBook, setSelectedBook] = useState(mockBooks[0].id);

  return (
    <AppShell>
      <div className="px-4 pt-5 space-y-4">
        <h1 className="text-lg font-bold text-foreground">회독표</h1>
        <BookSelector books={mockBooks} selectedId={selectedBook} onSelect={setSelectedBook} />
        <ReviewGrid />
      </div>
    </AppShell>
  );
}
