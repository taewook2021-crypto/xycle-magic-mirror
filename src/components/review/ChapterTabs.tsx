import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ChapterTab {
  id: string;
  number: number;
  title: string;
}

interface ChapterTabsProps {
  chapters: ChapterTab[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ChapterTabs({ chapters, selectedId, onSelect }: ChapterTabsProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-1 pb-1">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition-all whitespace-nowrap",
              selectedId === ch.id
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
            )}
          >
            {ch.number}. {ch.title}
          </button>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-1 pb-2">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-all whitespace-nowrap",
              selectedId === ch.id
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
            )}
          >
            {ch.number}. {ch.title}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
