import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  subject: string;
}

interface BookSelectorProps {
  books: Book[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function BookSelector({ books, selectedId, onSelect }: BookSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => onSelect(book.id)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            selectedId === book.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
          )}
        >
          {book.title}
        </button>
      ))}
    </div>
  );
}
