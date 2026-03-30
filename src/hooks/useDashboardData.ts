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

export interface BookProgress {
  bookId: string;
  title: string;
  author: string | null;
  subjectId: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
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
  const [bookProgress, setBookProgress] = useState<BookProgress[]>([]);
  const [userBooks, setUserBooks] = useState<UserBookInfo[]>([]);
  const [allBooks, setAllBooks] = useState<AvailableBook[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [todayAttempts, setTodayAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: subjects } = await supabase
      .from("subjects")
      .select("id, name, display_order")
      .order("display_order");

    if (!subjects) { setLoading(false); return; }

    const { data: booksFull } = await supabase
      .from("books")
      .select("id, title, author, subject_id, display_order")
      .order("display_order");

    setAllBooks(
      (booksFull || []).map((b) => ({
        id: b.id, title: b.title, author: b.author, subjectId: b.subject_id,
      }))
    );

    const { data: chapters } = await supabase.from("chapters").select("id, book_id");
    const { data: questions } = await supabase.from("questions").select("id, chapter_id");

    const { data: attempts } = await supabase
      .from("attempts")
      .select("id, question_id, is_correct, result, attempted_at")
      .eq("user_id", user.id);

    // Maps
    const chapterToBook = new Map<string, string>();
    chapters?.forEach((c) => chapterToBook.set(c.id, c.book_id));

    const bookToSubject = new Map<string, string>();
    booksFull?.forEach((b) => bookToSubject.set(b.id, b.subject_id));

    const questionToBook = new Map<string, string>();
    const questionToSubject = new Map<string, string>();
    questions?.forEach((q) => {
      const bookId = chapterToBook.get(q.chapter_id);
      if (bookId) {
        questionToBook.set(q.id, bookId);
        const subjectId = bookToSubject.get(bookId);
        if (subjectId) questionToSubject.set(q.id, subjectId);
      }
    });

    // Per-subject stats
    const subjectQuestionCount = new Map<string, number>();
    const subjectAttempted = new Map<string, Set<string>>();
    const subjectCorrect = new Map<string, number>();

    // Per-book stats
    const bookQuestionCount = new Map<string, number>();
    const bookAttempted = new Map<string, Set<string>>();
    const bookCorrect = new Map<string, number>();

    questions?.forEach((q) => {
      const sid = questionToSubject.get(q.id);
      if (sid) subjectQuestionCount.set(sid, (subjectQuestionCount.get(sid) || 0) + 1);
      const bid = questionToBook.get(q.id);
      if (bid) bookQuestionCount.set(bid, (bookQuestionCount.get(bid) || 0) + 1);
    });

    attempts?.forEach((a) => {
      const sid = questionToSubject.get(a.question_id);
      if (sid) {
        if (!subjectAttempted.has(sid)) subjectAttempted.set(sid, new Set());
        subjectAttempted.get(sid)!.add(a.question_id);
        if (a.result === "correct") subjectCorrect.set(sid, (subjectCorrect.get(sid) || 0) + 1);
      }
      const bid = questionToBook.get(a.question_id);
      if (bid) {
        if (!bookAttempted.has(bid)) bookAttempted.set(bid, new Set());
        bookAttempted.get(bid)!.add(a.question_id);
        if (a.result === "correct") bookCorrect.set(bid, (bookCorrect.get(bid) || 0) + 1);
      }
    });

    setSubjectProgress(subjects.map((s) => ({
      id: s.id,
      name: s.name,
      totalQuestions: subjectQuestionCount.get(s.id) || 0,
      attempted: subjectAttempted.get(s.id)?.size || 0,
      correct: subjectCorrect.get(s.id) || 0,
    })));

    setBookProgress(
      (booksFull || []).map((b) => ({
        bookId: b.id,
        title: b.title,
        author: b.author,
        subjectId: b.subject_id,
        totalQuestions: bookQuestionCount.get(b.id) || 0,
        attempted: bookAttempted.get(b.id)?.size || 0,
        correct: bookCorrect.get(b.id) || 0,
      }))
    );

    setTotalAttempts(attempts?.length || 0);

    // Today's attempts
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = attempts?.filter((a) => a.attempted_at.slice(0, 10) === todayStr).length || 0;
    setTodayAttempts(todayCount);

    // User books
    const { data: userBooksRaw } = await supabase
      .from("user_books")
      .select("id, book_id, display_order")
      .eq("user_id", user.id)
      .order("display_order");

    if (userBooksRaw && booksFull) {
      const bMap = new Map(booksFull.map((b) => [b.id, b]));
      const sMap = new Map(subjects.map((s) => [s.id, s.name]));

      setUserBooks(userBooksRaw.map((ub) => {
        const b = bMap.get(ub.book_id);
        return {
          id: ub.id, bookId: ub.book_id,
          title: b?.title || "—", author: b?.author || null,
          subjectId: b?.subject_id || "", subjectName: b ? sMap.get(b.subject_id) || "—" : "—",
        };
      }));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addBook = useCallback(async (bookId: string) => {
    if (!user) return;
    await supabase.from("user_books").insert({ user_id: user.id, book_id: bookId });
    await fetchData();
  }, [user, fetchData]);

  return { subjectProgress, bookProgress, userBooks, allBooks, totalAttempts, todayAttempts, loading, addBook };
}
