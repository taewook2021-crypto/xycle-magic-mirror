import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <Select value={selectedId ?? undefined} onValueChange={onSelect}>
      <SelectTrigger className="w-full h-9 text-xs font-medium rounded-full bg-[#f4f4f5] border-0 px-4">
        <SelectValue placeholder="단원 선택" />
      </SelectTrigger>
      <SelectContent>
        {chapters.map((ch) => (
          <SelectItem key={ch.id} value={ch.id} className="text-xs">
            {ch.number}. {ch.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
