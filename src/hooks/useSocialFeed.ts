import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { ActivityItem } from "@/components/dashboard/ActivityStream";
import type { BookFeedItem, PeerEntry } from "@/components/dashboard/LiveFeed";

export function useSocialFeed() {
  const { user, profile } = useAuth();

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  // Recent attempts from public users (last 2 hours for "live", today for feed)
  const { data: recentAttempts } = useQuery({
    queryKey: ["social-recent-attempts", todayStart],
    queryFn: async () => {
      const { data } = await supabase
        .from("attempts")
        .select("user_id, question_id, attempted_at, result")
        .gte("attempted_at", todayStart)
        .order("attempted_at", { ascending: false })
        .limit(500);
      return data ?? [];
    },
    refetchInterval: 60_000,
  });

  // Public profiles with exam_status
  const { data: profiles } = useQuery({
    queryKey: ["social-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, is_public, exam_status")
        .eq("is_public", true);
      return data ?? [];
    },
  });

  // Questions → chapters → books mapping
  const { data: questions } = useQuery({
    queryKey: ["social-questions"],
    queryFn: async () => {
      const { data } = await supabase.from("questions").select("id, chapter_id");
      return data ?? [];
    },
  });

  const { data: chapters } = useQuery({
    queryKey: ["social-chapters"],
    queryFn: async () => {
      const { data } = await supabase.from("chapters").select("id, book_id, title");
      return data ?? [];
    },
  });

  const { data: books } = useQuery({
    queryKey: ["social-books"],
    queryFn: async () => {
      const { data } = await supabase.from("books").select("id, title, subject_id, user_count_offset");
      return data ?? [];
    },
  });

  // User's registered books
  const { data: myUserBooks } = useQuery({
    queryKey: ["social-my-books", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_books")
        .select("book_id")
        .eq("user_id", user!.id);
      return (data ?? []).map((ub) => ub.book_id);
    },
    enabled: !!user,
  });

  const profileMap = useMemo(() => {
    const m = new Map<string, string>();
    profiles?.forEach((p) => m.set(p.id, p.display_name));
    return m;
  }, [profiles]);

  // Map of userId -> exam_status for filtering peers
  const examStatusMap = useMemo(() => {
    const m = new Map<string, string | null>();
    profiles?.forEach((p) => m.set(p.id, p.exam_status));
    return m;
  }, [profiles]);

  const chapterMap = useMemo(() => {
    const m = new Map<string, { bookId: string; title: string }>();
    chapters?.forEach((c) => m.set(c.id, { bookId: c.book_id, title: c.title }));
    return m;
  }, [chapters]);

  const questionToChapter = useMemo(() => {
    const m = new Map<string, string>();
    questions?.forEach((q) => m.set(q.id, q.chapter_id));
    return m;
  }, [questions]);

  const bookMap = useMemo(() => {
    const m = new Map<string, { title: string; offset: number }>();
    books?.forEach((b) => m.set(b.id, { title: b.title, offset: (b as any).user_count_offset ?? 0 }));
    return m;
  }, [books]);

  // Build activity stream items
  const activities: ActivityItem[] = useMemo(() => {
    if (!recentAttempts || !profileMap.size) return [];
    const now = Date.now();
    const twoHoursAgo = now - 2 * 60 * 60 * 1000;

    // Group by user → latest attempt
    const userLatest = new Map<string, {
      userId: string;
      questionId: string;
      attemptedAt: string;
      count: number;
    }>();

    for (const a of recentAttempts) {
      if (!profileMap.has(a.user_id) || a.user_id === user?.id) continue;
      const existing = userLatest.get(a.user_id);
      if (!existing) {
        userLatest.set(a.user_id, {
          userId: a.user_id,
          questionId: a.question_id,
          attemptedAt: a.attempted_at,
          count: 1,
        });
      } else {
        existing.count++;
        if (a.attempted_at > existing.attemptedAt) {
          existing.attemptedAt = a.attempted_at;
          existing.questionId = a.question_id;
        }
      }
    }

    return Array.from(userLatest.values())
      .map((entry) => {
        const chapterId = questionToChapter.get(entry.questionId);
        const chapter = chapterId ? chapterMap.get(chapterId) : null;
        const bookTitle = chapter ? bookMap.get(chapter.bookId) ?? "교재" : "교재";
        const minutesAgo = Math.max(1, Math.round((now - new Date(entry.attemptedAt).getTime()) / 60000));
        const isLive = new Date(entry.attemptedAt).getTime() > twoHoursAgo;

        return {
          id: entry.userId,
          userName: profileMap.get(entry.userId) ?? "?",
          bookTitle,
          chapterTitle: chapter?.title,
          questionCount: entry.count,
          minutesAgo,
          isLive,
        };
      })
      .sort((a, b) => a.minutesAgo - b.minutesAgo)
      .slice(0, 15);
  }, [recentAttempts, profileMap, questionToChapter, chapterMap, bookMap, user]);

  // Build live feed (per book comparison)
  const liveFeedBooks: BookFeedItem[] = useMemo(() => {
    if (!recentAttempts || !myUserBooks?.length) return [];

    // Count today's attempts per user per book
    const bookUserCounts = new Map<string, Map<string, number>>();

    const myExamStatus = profile?.exam_status;

    for (const a of recentAttempts) {
      const chapterId = questionToChapter.get(a.question_id);
      if (!chapterId) continue;
      const chapter = chapterMap.get(chapterId);
      if (!chapter) continue;
      if (!myUserBooks.includes(chapter.bookId)) continue;

      if (!bookUserCounts.has(chapter.bookId)) bookUserCounts.set(chapter.bookId, new Map());
      const userMap = bookUserCounts.get(chapter.bookId)!;
      userMap.set(a.user_id, (userMap.get(a.user_id) ?? 0) + 1);
    }

    return myUserBooks
      .filter((bookId) => bookUserCounts.has(bookId))
      .map((bookId) => {
        const userMap = bookUserCounts.get(bookId)!;
        const peers: PeerEntry[] = Array.from(userMap.entries())
          .map(([uid, count]) => ({
            id: uid,
            name: profileMap.get(uid) ?? (uid === user?.id ? (profile?.display_name ?? "나") : "?"),
            count,
            isMe: uid === user?.id,
            isPublic: true,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        const myCount = userMap.get(user?.id ?? "") ?? 0;
        // Only compare with peers who have the same exam_status
        const otherCounts = Array.from(userMap.entries())
          .filter(([uid]) => uid !== user?.id && (!myExamStatus || examStatusMap.get(uid) === myExamStatus))
          .map(([, c]) => c);
        const avgCount = otherCounts.length > 0
          ? Math.round(otherCounts.reduce((s, c) => s + c, 0) / otherCounts.length)
          : 0;
        const peerGroupLabel = myExamStatus || "전체";

        return {
          bookTitle: bookMap.get(bookId) ?? "교재",
          myCount,
          avgCount,
          peers,
          peerGroupLabel,
        };
      })
      .filter((b) => b.peers.length > 0);
  }, [recentAttempts, myUserBooks, questionToChapter, chapterMap, bookMap, profileMap, examStatusMap, user, profile]);

  return {
    activities,
    liveFeedBooks,
    isMePublic: profile?.is_public ?? false,
  };
}
