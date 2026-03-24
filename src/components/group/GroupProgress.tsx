import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GroupMember } from "@/hooks/useStudyGroup";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  members: GroupMember[];
}

interface BookProgress {
  bookId: string;
  bookTitle: string;
  totalQuestions: number;
  memberProgress: {
    userId: string;
    name: string;
    avatarUrl: string | null;
    attempted: number;
    percent: number;
  }[];
}

export default function GroupProgress({ members }: Props) {
  const { user } = useAuth();
  const memberIds = members.map((m) => m.user_id);

  const { data: progress = [], isLoading } = useQuery({
    queryKey: ["group-progress", memberIds.sort().join(",")],
    queryFn: async () => {
      if (!memberIds.length) return [];

      // Get all books members are subscribed to
      const { data: userBooks } = await supabase
        .from("user_books")
        .select("user_id, book_id")
        .in("user_id", memberIds);

      if (!userBooks?.length) return [];

      const bookIds = [...new Set(userBooks.map((ub: any) => ub.book_id))];

      // Get book titles
      const { data: books } = await supabase
        .from("books")
        .select("id, title")
        .in("id", bookIds);

      // Get chapter ids for these books
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, book_id")
        .in("book_id", bookIds);

      if (!chapters?.length) return [];

      const chapterIds = chapters.map((c: any) => c.id);
      const chapterToBook = new Map(chapters.map((c: any) => [c.id, c.book_id]));

      // Get question counts per book
      const { data: questions } = await supabase
        .from("questions")
        .select("id, chapter_id")
        .in("chapter_id", chapterIds);

      const questionToBook = new Map<string, string>();
      const bookQuestionCount = new Map<string, number>();
      (questions ?? []).forEach((q: any) => {
        const bId = chapterToBook.get(q.chapter_id);
        if (bId) {
          questionToBook.set(q.id, bId);
          bookQuestionCount.set(bId, (bookQuestionCount.get(bId) ?? 0) + 1);
        }
      });

      // Get attempts for members (distinct question_id per user per book)
      const { data: attempts } = await supabase
        .from("attempts")
        .select("user_id, question_id")
        .in("user_id", memberIds);

      // Count unique questions attempted per user per book
      const userBookAttempted = new Map<string, Set<string>>();
      (attempts ?? []).forEach((a: any) => {
        const bId = questionToBook.get(a.question_id);
        if (!bId) return;
        const key = `${a.user_id}:${bId}`;
        if (!userBookAttempted.has(key)) userBookAttempted.set(key, new Set());
        userBookAttempted.get(key)!.add(a.question_id);
      });

      const bookMap = new Map((books ?? []).map((b: any) => [b.id, b.title]));
      const profileMap = new Map(members.map((m) => [m.user_id, m.profile]));

      // Build progress per book (only books with 2+ members subscribed)
      const bookMemberMap = new Map<string, string[]>();
      (userBooks ?? []).forEach((ub: any) => {
        if (!bookMemberMap.has(ub.book_id)) bookMemberMap.set(ub.book_id, []);
        bookMemberMap.get(ub.book_id)!.push(ub.user_id);
      });

      const result: BookProgress[] = [];
      for (const [bookId, uids] of bookMemberMap) {
        if (uids.length < 2) continue;
        const total = bookQuestionCount.get(bookId) ?? 0;
        if (total === 0) continue;
        const memberProgress = uids.map((uid) => {
          const prof = profileMap.get(uid);
          const attempted = userBookAttempted.get(`${uid}:${bookId}`)?.size ?? 0;
          return {
            userId: uid,
            name: prof?.display_name ?? "사용자",
            avatarUrl: prof?.avatar_url ?? null,
            attempted,
            percent: Math.round((attempted / total) * 100),
          };
        }).sort((a, b) => b.percent - a.percent);

        result.push({
          bookId,
          bookTitle: bookMap.get(bookId) ?? "교재",
          totalQuestions: total,
          memberProgress,
        });
      }

      return result;
    },
    enabled: memberIds.length > 0,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-10">불러오는 중…</p>;
  }

  if (progress.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        공통 교재가 없습니다. 2명 이상이 같은 교재를 추가하면 진도를 비교할 수 있습니다.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {progress.map((bp) => (
        <div key={bp.bookId}>
          <h3 className="text-sm font-semibold text-foreground mb-3">{bp.bookTitle}</h3>
          <div className="space-y-2.5">
            {bp.memberProgress.map((mp) => {
              const isMe = mp.userId === user?.id;
              return (
                <div key={mp.userId} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {mp.avatarUrl ? (
                      <img src={mp.avatarUrl} alt={mp.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className={cn("text-xs font-medium w-16 truncate flex-shrink-0", isMe && "text-primary")}>
                    {mp.name}{isMe ? " (나)" : ""}
                  </span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isMe ? "bg-primary" : "bg-primary/40"
                      )}
                      style={{ width: `${Math.max(mp.percent, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground tabular-nums w-10 text-right">
                    {mp.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
