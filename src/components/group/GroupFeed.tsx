import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GroupMember } from "@/hooks/useStudyGroup";
import { User, BookOpen } from "lucide-react";
import { format, startOfDay, isToday, isYesterday } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  members: GroupMember[];
}

interface DayActivity {
  userId: string;
  name: string;
  avatarUrl: string | null;
  date: string; // YYYY-MM-DD
  books: { bookTitle: string; chapters: string[]; count: number }[];
  totalCount: number;
}

export default function GroupFeed({ members }: Props) {
  const memberIds = members.map((m) => m.user_id);

  const { data: feed = [], isLoading } = useQuery({
    queryKey: ["group-feed", memberIds.sort().join(",")],
    queryFn: async () => {
      if (!memberIds.length) return [];

      // Get recent attempts (last 7 days worth)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: attempts } = await supabase
        .from("attempts")
        .select("user_id, question_id, attempted_at")
        .in("user_id", memberIds)
        .gte("attempted_at", sevenDaysAgo.toISOString())
        .order("attempted_at", { ascending: false });

      if (!attempts?.length) return [];

      const questionIds = [...new Set(attempts.map((a: any) => a.question_id))];

      const { data: questions } = await supabase
        .from("questions")
        .select("id, chapter_id")
        .in("id", questionIds);

      const questionChapterMap = new Map((questions ?? []).map((q: any) => [q.id, q.chapter_id]));
      const chapterIds = [...new Set((questions ?? []).map((q: any) => q.chapter_id))];

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, title, book_id")
        .in("id", chapterIds);

      const chapterMap = new Map((chapters ?? []).map((c: any) => [c.id, c]));
      const bookIds = [...new Set((chapters ?? []).map((c: any) => c.book_id))];

      const { data: books } = await supabase
        .from("books")
        .select("id, title")
        .in("id", bookIds);

      const bookMap = new Map((books ?? []).map((b: any) => [b.id, b.title]));
      const profileMap = new Map(members.map((m) => [m.user_id, m.profile]));

      // Group by user + date -> book -> chapters
      const dayMap = new Map<string, {
        userId: string;
        date: string;
        bookChapters: Map<string, { bookTitle: string; chapters: Set<string>; count: number }>;
        totalCount: number;
      }>();

      for (const a of attempts as any[]) {
        const chapterId = questionChapterMap.get(a.question_id);
        if (!chapterId) continue;
        const chapter = chapterMap.get(chapterId);
        if (!chapter) continue;

        const dateStr = a.attempted_at.slice(0, 10);
        const dayKey = `${a.user_id}:${dateStr}`;

        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            userId: a.user_id,
            date: dateStr,
            bookChapters: new Map(),
            totalCount: 0,
          });
        }

        const entry = dayMap.get(dayKey)!;
        entry.totalCount++;

        const bookTitle = bookMap.get(chapter.book_id) ?? "교재";
        const bookKey = chapter.book_id;
        if (!entry.bookChapters.has(bookKey)) {
          entry.bookChapters.set(bookKey, { bookTitle, chapters: new Set(), count: 0 });
        }
        const bc = entry.bookChapters.get(bookKey)!;
        bc.chapters.add(chapter.title);
        bc.count++;
      }

      // Convert to array
      const result: DayActivity[] = [...dayMap.values()].map((d) => {
        const prof = profileMap.get(d.userId);
        return {
          userId: d.userId,
          name: prof?.display_name ?? "사용자",
          avatarUrl: prof?.avatar_url ?? null,
          date: d.date,
          books: [...d.bookChapters.values()].map((bc) => ({
            bookTitle: bc.bookTitle,
            chapters: [...bc.chapters],
            count: bc.count,
          })),
          totalCount: d.totalCount,
        };
      });

      // Sort by date desc, then totalCount desc
      return result.sort((a, b) => {
        const dateCmp = b.date.localeCompare(a.date);
        if (dateCmp !== 0) return dateCmp;
        return b.totalCount - a.totalCount;
      });
    },
    enabled: memberIds.length > 0,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-10">불러오는 중…</p>;
  }

  if (feed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        최근 7일간 학습 활동이 없습니다.
      </p>
    );
  }

  // Group feed items by date for section headers
  const dateGroups = new Map<string, DayActivity[]>();
  for (const item of feed) {
    if (!dateGroups.has(item.date)) dateGroups.set(item.date, []);
    dateGroups.get(item.date)!.push(item);
  }

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    if (isToday(d)) return "오늘";
    if (isYesterday(d)) return "어제";
    return format(d, "M월 d일 (EEE)", { locale: ko });
  };

  return (
    <div className="space-y-6">
      {[...dateGroups.entries()].map(([date, items]) => (
        <div key={date}>
          <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">
            {formatDateLabel(date)}
          </p>
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={`${item.userId}-${item.date}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center mt-0.5">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-muted-foreground ml-1.5">{item.totalCount}문제</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {item.books.map((b) => (
                      <span
                        key={b.bookTitle}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[11px] text-foreground"
                      >
                        <BookOpen className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate max-w-[120px]">{b.bookTitle}</span>
                        <span className="text-muted-foreground">· {b.count}문제</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
