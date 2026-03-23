import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PeerAvgInfo {
  bookId: string;
  avgRound: number;
  avgChapterTitle: string;
  peerCount: number;
}

export function usePeerAvgProgress() {
  const { user, profile } = useAuth();
  const [peerAvgMap, setPeerAvgMap] = useState<Map<string, PeerAvgInfo>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile?.exam_status) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);

      // 1. Get peers with same exam_status
      const { data: peers } = await supabase
        .from("profiles")
        .select("id")
        .eq("exam_status", profile.exam_status!)
        .eq("is_public", true);

      if (!peers || peers.length === 0) {
        setLoading(false);
        return;
      }

      const peerIds = peers.map((p) => p.id).filter((id) => id !== user.id);
      if (peerIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Get chapter → book mapping
      const { data: chapters } = await supabase.from("chapters").select("id, book_id, title, chapter_number");
      if (!chapters) { setLoading(false); return; }

      const chapterToBook = new Map<string, string>();
      const chapterInfo = new Map<string, { title: string; number: number }>();
      chapters.forEach((c) => {
        chapterToBook.set(c.id, c.book_id);
        chapterInfo.set(c.id, { title: c.title, number: c.chapter_number });
      });

      // 3. Get question → chapter mapping
      const { data: questions } = await supabase.from("questions").select("id, chapter_id");
      if (!questions) { setLoading(false); return; }

      const questionToChapter = new Map<string, string>();
      questions.forEach((q) => questionToChapter.set(q.id, q.chapter_id));

      // 4. Get peer attempts (batch by peer ids, limited)
      // We'll query in chunks to avoid hitting limits
      const allAttempts: { user_id: string; question_id: string; round: number; attempted_at: string }[] = [];

      for (let i = 0; i < peerIds.length; i += 20) {
        const chunk = peerIds.slice(i, i + 20);
        const { data } = await supabase
          .from("attempts")
          .select("user_id, question_id, round, attempted_at")
          .in("user_id", chunk);
        if (data) allAttempts.push(...data);
      }

      // 5. Aggregate per book per user: max round, latest chapter
      // Structure: bookId → userId → { maxRound, latestChapterId, latestAt }
      const bookUserMap = new Map<string, Map<string, { maxRound: number; latestChapterId: string; latestAt: string }>>();

      for (const a of allAttempts) {
        const chapterId = questionToChapter.get(a.question_id);
        if (!chapterId) continue;
        const bookId = chapterToBook.get(chapterId);
        if (!bookId) continue;

        if (!bookUserMap.has(bookId)) bookUserMap.set(bookId, new Map());
        const userMap = bookUserMap.get(bookId)!;

        const prev = userMap.get(a.user_id);
        if (!prev) {
          userMap.set(a.user_id, { maxRound: a.round, latestChapterId: chapterId, latestAt: a.attempted_at });
        } else {
          if (a.round > prev.maxRound) prev.maxRound = a.round;
          if (a.attempted_at > prev.latestAt) {
            prev.latestChapterId = chapterId;
            prev.latestAt = a.attempted_at;
          }
        }
      }

      // 6. Calculate averages
      const result = new Map<string, PeerAvgInfo>();

      for (const [bookId, userMap] of bookUserMap) {
        const users = Array.from(userMap.values());
        const avgRound = Math.round((users.reduce((s, u) => s + u.maxRound, 0) / users.length) * 10) / 10;

        // Most common latest chapter
        const chapterCounts = new Map<string, number>();
        users.forEach((u) => {
          chapterCounts.set(u.latestChapterId, (chapterCounts.get(u.latestChapterId) || 0) + 1);
        });
        let topChapterId = "";
        let topCount = 0;
        for (const [cid, count] of chapterCounts) {
          if (count > topCount) { topChapterId = cid; topCount = count; }
        }

        const ci = chapterInfo.get(topChapterId);
        const avgChapterTitle = ci ? `Ch.${ci.number} ${ci.title}` : "";

        result.set(bookId, { bookId, avgRound, avgChapterTitle, peerCount: users.length });
      }

      setPeerAvgMap(result);
      setLoading(false);
    };

    fetch();
  }, [user, profile?.exam_status]);

  return { peerAvgMap, loading, examStatus: profile?.exam_status ?? null };
}
