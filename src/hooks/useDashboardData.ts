import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface SubjectProgress {
  id: string;
  name: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
}

export interface RecentAttempt {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  questionNumber: number;
  result: string;
  attemptedAt: string;
}

export interface UserBookInfo {
  id: string;
  bookId: string;
  title: string;
  author: string | null;
  subjectId: string;
  subjectName: string;
}

export interface AvailableBook {
  id: string;
  title: string;
  author: string | null;
  subjectId: string;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [userBooks, setUserBooks] = useState<UserBookInfo[]>([]);
  const [allBooks, setAllBooks] = useState<AvailableBook[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Get all subjects
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id, name, display_order")
      .order("display_order");

    if (!subjects) {
      setLoading(false);
      return;
    }

    // 2. Get all books
    const { data: booksFull } = await supabase
      .from("books")
      .select("id, title, author, subject_id, display_order")
      .order("display_order");

    setAllBooks(
      (booksFull || []).map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        subjectId: b.subject_id,
      }))
    );

    // 3. Get chapters & questions
    const { data: chapters } = await supabase.from("chapters").select("id, book_id");
    const { data: questions } = await supabase.from("questions").select("id, chapter_id");

    // 4. Get user's attempts
    const { data: attempts } = await supabase
      .from("attempts")
      .select("id, question_id, is_correct, result, attempted_at")
      .eq("user_id", user.id);

    // Build lookup maps
    const chapterToBook = new Map<string, string>();
    chapters?.forEach((c) => chapterToBook.set(c.id, c.book_id));

    const bookToSubject = new Map<string, string>();
    booksFull?.forEach((b) => bookToSubject.set(b.id, b.subject_id));

    const questionToSubject = new Map<string, string>();
    questions?.forEach((q) => {
      const bookId = chapterToBook.get(q.chapter_id);
      if (bookId) {
        const subjectId = bookToSubject.get(bookId);
        if (subjectId) questionToSubject.set(q.id, subjectId);
      }
    });

    // Count questions per subject
    const subjectQuestionCount = new Map<string, number>();
    questions?.forEach((q) => {
      const sid = questionToSubject.get(q.id);
      if (sid) subjectQuestionCount.set(sid, (subjectQuestionCount.get(sid) || 0) + 1);
    });

    // Count attempts per subject
    const subjectAttempted = new Map<string, Set<string>>();
    const subjectCorrect = new Map<string, number>();

    attempts?.forEach((a) => {
      const sid = questionToSubject.get(a.question_id);
      if (!sid) return;
      if (!subjectAttempted.has(sid)) subjectAttempted.set(sid, new Set());
      subjectAttempted.get(sid)!.add(a.question_id);
      if (a.result === "correct") {
        subjectCorrect.set(sid, (subjectCorrect.get(sid) || 0) + 1);
      }
    });

    const progress: SubjectProgress[] = subjects.map((s) => ({
      id: s.id,
      name: s.name,
      totalQuestions: subjectQuestionCount.get(s.id) || 0,
      attempted: subjectAttempted.get(s.id)?.size || 0,
      correct: subjectCorrect.get(s.id) || 0,
    }));

    setSubjectProgress(progress);
    setTotalAttempts(attempts?.length || 0);

    // 5. Recent attempts (last 20)
    const { data: recentRaw } = await supabase
      .from("attempts")
      .select("id, question_id, result, attempted_at")
      .eq("user_id", user.id)
      .order("attempted_at", { ascending: false })
      .limit(20);

    if (recentRaw && questions && chapters && booksFull) {
      const { data: chaptersFull } = await supabase
        .from("chapters")
        .select("id, title, book_id, chapter_number");
      const { data: questionsFull } = await supabase
        .from("questions")
        .select("id, chapter_id, question_number");

      const chFullMap = new Map(chaptersFull?.map((c) => [c.id, c]));
      const bFullMap = new Map(booksFull.map((b) => [b.id, b]));
      const qFullMap = new Map(questionsFull?.map((q) => [q.id, q]));

      const recent: RecentAttempt[] = recentRaw.map((a) => {
        const q = qFullMap.get(a.question_id);
        const ch = q ? chFullMap.get(q.chapter_id) : undefined;
        const bk = ch ? bFullMap.get(ch.book_id) : undefined;
        return {
          id: a.id,
          bookTitle: bk?.title || "—",
          chapterTitle: ch?.title || "—",
          questionNumber: q?.question_number || 0,
          result: a.result,
          attemptedAt: a.attempted_at,
        };
      });
      setRecentAttempts(recent);
    }

    // 6. User books
    const { data: userBooksRaw } = await supabase
      .from("user_books")
      .select("id, book_id")
      .eq("user_id", user.id);

    if (userBooksRaw && booksFull) {
      const bMap = new Map(booksFull.map((b) => [b.id, b]));
      const sMap = new Map(subjects.map((s) => [s.id, s.name]));

      const ub: UserBookInfo[] = userBooksRaw.map((ub) => {
        const b = bMap.get(ub.book_id);
        return {
          id: ub.id,
          bookId: ub.book_id,
          title: b?.title || "—",
          author: b?.author || null,
          subjectId: b?.subject_id || "",
          subjectName: b ? sMap.get(b.subject_id) || "—" : "—",
        };
      });
      setUserBooks(ub);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addBook = useCallback(
    async (bookId: string) => {
      if (!user) return;
      await supabase.from("user_books").insert({ user_id: user.id, book_id: bookId });
      await fetchData();
    },
    [user, fetchData]
  );

  return { subjectProgress, recentAttempts, userBooks, allBooks, totalAttempts, loading, addBook };
}
