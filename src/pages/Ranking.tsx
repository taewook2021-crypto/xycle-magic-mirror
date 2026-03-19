import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Flame, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAM_GROUPS = [
  { value: "all", label: "전체" },
  { value: "초시생", label: "초시생" },
  { value: "동차생", label: "동차생" },
  { value: "유예생", label: "유예생" },
  { value: "N시생", label: "N시생" },
];

export default function Ranking() {
  const { user } = useAuth();
  const [group, setGroup] = useState("all");
  const [selectedBook, setSelectedBook] = useState<string>("all");

  // Fetch public profiles
  const { data: profiles } = useQuery({
    queryKey: ["ranking-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, is_public")
        .eq("is_public", true);
      return data ?? [];
    },
  });

  // Fetch today's attempts for all public users
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const { data: todayAttempts } = useQuery({
    queryKey: ["ranking-today-attempts", todayStart],
    queryFn: async () => {
      const { data } = await supabase
        .from("attempts")
        .select("user_id, question_id")
        .gte("attempted_at", todayStart);
      return data ?? [];
    },
  });

  // Fetch user's registered books only
  const { data: books } = useQuery({
    queryKey: ["ranking-books", user?.id],
    queryFn: async () => {
      const { data: userBooks } = await supabase
        .from("user_books")
        .select("book_id")
        .eq("user_id", user!.id);
      if (!userBooks?.length) return [];
      const bookIds = userBooks.map((ub) => ub.book_id);
      const { data } = await supabase
        .from("books")
        .select("id, title, subject_id")
        .in("id", bookIds)
        .order("display_order");
      return data ?? [];
    },
    enabled: !!user,
  });

  // Fetch all attempts (for book-based ranking)
  const { data: allAttempts } = useQuery({
    queryKey: ["ranking-all-attempts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("attempts")
        .select("user_id, question_id");
      return data ?? [];
    },
  });

  // Fetch questions with chapter→book mapping
  const { data: questions } = useQuery({
    queryKey: ["ranking-questions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("questions")
        .select("id, chapter_id");
      return data ?? [];
    },
  });

  const { data: chapters } = useQuery({
    queryKey: ["ranking-chapters"],
    queryFn: async () => {
      const { data } = await supabase
        .from("chapters")
        .select("id, book_id");
      return data ?? [];
    },
  });

  // Build lookup maps
  const chapterToBook = useMemo(() => {
    const m = new Map<string, string>();
    chapters?.forEach((c) => m.set(c.id, c.book_id));
    return m;
  }, [chapters]);

  const questionToBook = useMemo(() => {
    const m = new Map<string, string>();
    questions?.forEach((q) => {
      const bookId = chapterToBook.get(q.chapter_id);
      if (bookId) m.set(q.id, bookId);
    });
    return m;
  }, [questions, chapterToBook]);

  const questionsPerBook = useMemo(() => {
    const m = new Map<string, number>();
    questions?.forEach((q) => {
      const bookId = questionToBook.get(q.id);
      if (bookId) m.set(bookId, (m.get(bookId) ?? 0) + 1);
    });
    return m;
  }, [questions, questionToBook]);

  // Filter profiles by group
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (group === "all") return profiles;
    return profiles.filter((p) => p.exam_status === group);
  }, [profiles, group]);

  const profileMap = useMemo(() => {
    const m = new Map<string, (typeof profiles extends (infer T)[] | null ? T : never)>();
    filteredProfiles.forEach((p) => m.set(p.id, p));
    return m;
  }, [filteredProfiles]);

  // Today's ranking
  const todayRanking = useMemo(() => {
    if (!todayAttempts) return [];
    const counts = new Map<string, number>();
    todayAttempts.forEach((a) => {
      if (profileMap.has(a.user_id)) {
        counts.set(a.user_id, (counts.get(a.user_id) ?? 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([userId, count]) => ({
        userId,
        name: profileMap.get(userId)?.display_name ?? "?",
        examStatus: profileMap.get(userId)?.exam_status ?? "",
        count,
        isMe: userId === user?.id,
      }))
      .sort((a, b) => b.count - a.count);
  }, [todayAttempts, profileMap, user]);

  // Book-based ranking
  const bookRanking = useMemo(() => {
    if (!allAttempts || selectedBook === "all") return [];
    const counts = new Map<string, Set<string>>();
    allAttempts.forEach((a) => {
      const bookId = questionToBook.get(a.question_id);
      if (bookId === selectedBook && profileMap.has(a.user_id)) {
        if (!counts.has(a.user_id)) counts.set(a.user_id, new Set());
        counts.get(a.user_id)!.add(a.question_id);
      }
    });
    const totalQ = questionsPerBook.get(selectedBook) ?? 1;
    return Array.from(counts.entries())
      .map(([userId, qs]) => ({
        userId,
        name: profileMap.get(userId)?.display_name ?? "?",
        examStatus: profileMap.get(userId)?.exam_status ?? "",
        solved: qs.size,
        total: totalQ,
        pct: Math.round((qs.size / totalQ) * 100),
        isMe: userId === user?.id,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [allAttempts, selectedBook, questionToBook, questionsPerBook, profileMap, user]);

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-5 pb-24 md:pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">랭킹</h1>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXAM_GROUPS.map((g) => (
                <SelectItem key={g.value} value={g.value} className="text-xs">
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="today">
          <TabsList className="w-full">
            <TabsTrigger value="today" className="flex-1 text-xs gap-1">
              <Flame className="h-3.5 w-3.5" />
              오늘의 풀이왕
            </TabsTrigger>
            <TabsTrigger value="book" className="flex-1 text-xs gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              교재별
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-2 mt-3">
            {todayRanking.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">아직 오늘 풀이 기록이 없습니다.</p>
            ) : (
              todayRanking.map((r, i) => (
                <Card key={r.userId} className={cn(r.isMe && "ring-1 ring-primary")}>
                  <CardContent className="flex items-center gap-3 py-3 px-4">
                    <span className={cn(
                      "w-6 text-center font-bold text-sm",
                      i === 0 && "text-yellow-500",
                      i === 1 && "text-gray-400",
                      i === 2 && "text-amber-600",
                      i > 2 && "text-muted-foreground"
                    )}>
                      {i === 0 ? <Trophy className="h-4 w-4 mx-auto text-yellow-500" /> : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {r.name}
                        {r.isMe && <span className="text-xs text-primary ml-1">(나)</span>}
                      </p>
                      {r.examStatus && (
                        <span className="text-[10px] text-muted-foreground">{r.examStatus}</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{r.count}문제</span>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="book" className="space-y-3 mt-3">
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="교재 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">교재를 선택하세요</SelectItem>
                {books?.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-sm">{b.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBook === "all" ? (
              <p className="text-sm text-muted-foreground text-center py-8">교재를 선택해주세요.</p>
            ) : bookRanking.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">풀이 기록이 없습니다.</p>
            ) : (
              bookRanking.map((r, i) => (
                <Card key={r.userId} className={cn(r.isMe && "ring-1 ring-primary")}>
                  <CardContent className="flex items-center gap-3 py-3 px-4">
                    <span className={cn(
                      "w-6 text-center font-bold text-sm",
                      i === 0 && "text-yellow-500",
                      i === 1 && "text-gray-400",
                      i === 2 && "text-amber-600",
                      i > 2 && "text-muted-foreground"
                    )}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {r.name}
                        {r.isMe && <span className="text-xs text-primary ml-1">(나)</span>}
                      </p>
                      {r.examStatus && (
                        <span className="text-[10px] text-muted-foreground">{r.examStatus}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-foreground">{r.pct}%</span>
                      <p className="text-[10px] text-muted-foreground">{r.solved}/{r.total}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
