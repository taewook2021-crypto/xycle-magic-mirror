import { useEffect, useState } from "react";
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
  subjectName: string;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [userBooks, setUserBooks] = useState<UserBookInfo[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
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

      // 2. Get question counts per subject via books→chapters→questions
      const { data: books } = await supabase
        .from("books")
        .select("id, subject_id");

      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, book_id");

      const { data: questions } = await supabase
        .from("questions")
        .select("id, chapter_id");

      // 3. Get user's attempts
      const { data: attempts } = await supabase
        .from("attempts")
        .select("id, question_id, is_correct, result, attempted_at")
        .eq("user_id", user!.id);

      // Build lookup maps
      const chapterToBook = new Map<string, string>();
      chapters?.forEach((c) => chapterToBook.set(c.id, c.book_id));

      const bookToSubject = new Map<string, string>();
      books?.forEach((b) => bookToSubject.set(b.id, b.subject_id));

      // Question → subject mapping
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

      // Count attempts per subject (deduplicated by question_id — count unique questions attempted)
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

      // 4. Recent attempts (last 20)
      const { data: recentRaw } = await supabase
        .from("attempts")
        .select("id, question_id, result, attempted_at")
        .eq("user_id", user!.id)
        .order("attempted_at", { ascending: false })
        .limit(20);

      if (recentRaw && questions && chapters && books) {
        const questionMap = new Map(questions.map((q) => [q.id, q]));
        const chapterMap = new Map(chapters.map((c) => [c.id, c]));
        const bookMap = new Map(books.map((b) => [b.id, b]));

        // Need chapter titles and book titles
        const { data: chaptersFull } = await supabase
          .from("chapters")
          .select("id, title, book_id, chapter_number");
        const { data: booksFull } = await supabase
          .from("books")
          .select("id, title, author");
        const { data: questionsFull } = await supabase
          .from("questions")
          .select("id, chapter_id, question_number");

        const chFullMap = new Map(chaptersFull?.map((c) => [c.id, c]));
        const bFullMap = new Map(booksFull?.map((b) => [b.id, b]));
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

      // 5. User books
      const { data: userBooksRaw } = await supabase
        .from("user_books")
        .select("id, book_id")
        .eq("user_id", user!.id);

      if (userBooksRaw) {
        const { data: booksFull } = await supabase
          .from("books")
          .select("id, title, author, subject_id");
        const bMap = new Map(booksFull?.map((b) => [b.id, b]));
        const sMap = new Map(subjects.map((s) => [s.id, s.name]));

        const ub: UserBookInfo[] = userBooksRaw.map((ub) => {
          const b = bMap.get(ub.book_id);
          return {
            id: ub.id,
            bookId: ub.book_id,
            title: b?.title || "—",
            author: b?.author || null,
            subjectName: b ? sMap.get(b.subject_id) || "—" : "—",
          };
        });
        setUserBooks(ub);
      }

      setLoading(false);
    }

    fetchData();
  }, [user]);

  return { subjectProgress, recentAttempts, userBooks, totalAttempts, loading };
}
