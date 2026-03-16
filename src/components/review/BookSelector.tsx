import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Book {
  id: string;
  title: string;
  subject: string;
}

interface BookSelectorProps {
  books: Book[];
  selectedId: string;
  onSelect: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function BookSelector({ books, selectedId, onSelect, onRemove }: BookSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => onSelect(book.id)}
          className={cn(
            "group flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            selectedId === book.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
          )}
        >
          {book.title}
          {onRemove && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(book.id);
              }}
              className={cn(
                "ml-0.5 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/20",
                selectedId === book.id ? "opacity-60" : ""
              )}
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
