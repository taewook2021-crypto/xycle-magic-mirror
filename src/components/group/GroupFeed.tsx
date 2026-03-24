import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GroupMember } from "@/hooks/useStudyGroup";
import { User, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  members: GroupMember[];
}

interface FeedItem {
  userId: string;
  name: string;
  avatarUrl: string | null;
  bookTitle: string;
  chapterTitle: string;
  attemptedAt: string;
}

export default function GroupFeed({ members }: Props) {
  const memberIds = members.map((m) => m.user_id);

  const { data: feed = [], isLoading } = useQuery({
    queryKey: ["group-feed", memberIds.sort().join(",")],
    queryFn: async () => {
      if (!memberIds.length) return [];

      // Get recent attempts from members (last 50)
      const { data: attempts } = await supabase
        .from("attempts")
        .select("user_id, question_id, attempted_at")
        .in("user_id", memberIds)
        .order("attempted_at", { ascending: false })
        .limit(200);

      if (!attempts?.length) return [];

      // Get unique question ids
      const questionIds = [...new Set(attempts.map((a: any) => a.question_id))];

      // Get questions -> chapters
      const { data: questions } = await supabase
        .from("questions")
        .select("id, chapter_id")
        .in("id", questionIds);

      const questionChapterMap = new Map((questions ?? []).map((q: any) => [q.id, q.chapter_id]));
      const chapterIds = [...new Set((questions ?? []).map((q: any) => q.chapter_id))];

      // Get chapters -> books
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, title, book_id")
        .in("id", chapterIds);

      const chapterMap = new Map((chapters ?? []).map((c: any) => [c.id, c]));
      const bookIds = [...new Set((chapters ?? []).map((c: any) => c.book_id))];

      // Get books
      const { data: books } = await supabase
        .from("books")
        .select("id, title")
        .in("id", bookIds);

      const bookMap = new Map((books ?? []).map((b: any) => [b.id, b.title]));
      const profileMap = new Map(members.map((m) => [m.user_id, m.profile]));

      // Group attempts by user + book + chapter + time window (group within 5 min)
      const grouped = new Map<string, FeedItem & { latestAt: Date }>();

      for (const a of attempts as any[]) {
        const chapterId = questionChapterMap.get(a.question_id);
        if (!chapterId) continue;
        const chapter = chapterMap.get(chapterId);
        if (!chapter) continue;
        const bookTitle = bookMap.get(chapter.book_id) ?? "교재";

        // Round to 5-min window for grouping
        const at = new Date(a.attempted_at);
        const windowKey = `${a.user_id}:${chapter.book_id}:${chapterId}:${Math.floor(at.getTime() / 300000)}`;

        if (!grouped.has(windowKey)) {
          const prof = profileMap.get(a.user_id);
          grouped.set(windowKey, {
            userId: a.user_id,
            name: prof?.display_name ?? "사용자",
            avatarUrl: prof?.avatar_url ?? null,
            bookTitle,
            chapterTitle: chapter.title,
            attemptedAt: a.attempted_at,
            latestAt: at,
          });
        }
      }

      // Sort by latest and take top 30
      return [...grouped.values()]
        .sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime())
        .slice(0, 30)
        .map(({ latestAt, ...rest }) => rest);
    },
    enabled: memberIds.length > 0,
    refetchInterval: 30000, // Refresh every 30s
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-10">불러오는 중…</p>;
  }

  if (feed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        아직 학습 활동이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {feed.map((item, i) => (
        <div
          key={`${item.userId}-${item.attemptedAt}-${i}`}
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
              <span className="text-muted-foreground"> 님이 </span>
              <span className="font-medium">{item.bookTitle}</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-primary font-medium">{item.chapterTitle}</span>
              <span className="text-muted-foreground"> 풀이 중</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(item.attemptedAt), { addSuffix: true, locale: ko })}
            </p>
          </div>
          <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
      ))}
    </div>
  );
}
