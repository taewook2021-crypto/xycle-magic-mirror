import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, BookOpen, User, UserPlus, UserMinus, Target, Hash, CheckCircle, Calendar, Search, Eye, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import PeerReviewSheet from "@/components/dashboard/PeerReviewSheet";
import PeerProfileCard from "@/components/ranking/PeerProfileCard";

const EXAM_GROUPS = [
  { value: "all", label: "전체" },
  { value: "초시생", label: "초시생" },
  { value: "동차생", label: "동차생" },
  { value: "유예생", label: "유예생" },
  { value: "N시생", label: "N시생" },
];

const SORT_OPTIONS = [
  { value: "today-count", label: "오늘 풀이 수", icon: Hash },
  { value: "total-count", label: "누적 풀이 수", icon: Target },
  { value: "today-correct", label: "오늘 정답률", icon: CheckCircle },
  { value: "streak", label: "연속 학습일", icon: Calendar },
];

export default function Ranking() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [group, setGroup] = useState("all");
  const [sortBy, setSortBy] = useState("today-count");
  const [activeTab, setActiveTab] = useState<"today" | "book">("today");
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [peerReviewOpen, setPeerReviewOpen] = useState(false);
  const [peerReviewUserId, setPeerReviewUserId] = useState<string>("");
  const [peerReviewName, setPeerReviewName] = useState("");

  // Fetch public profiles
  const { data: profiles } = useQuery({
    queryKey: ["ranking-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, is_public, avatar_url")
        .eq("is_public", true);
      return data ?? [];
    },
  });

  // Fetch my follows
  const { data: myFollows } = useQuery({
    queryKey: ["my-follows", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user!.id);
      return new Set((data ?? []).map((f) => f.following_id));
    },
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: user!.id, following_id: targetId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-follows"] });
      queryClient.invalidateQueries({ queryKey: ["follower-count"] });
      queryClient.invalidateQueries({ queryKey: ["following-count"] });
      toast({ title: "팔로우했습니다." });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user!.id)
        .eq("following_id", targetId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-follows"] });
      queryClient.invalidateQueries({ queryKey: ["follower-count"] });
      queryClient.invalidateQueries({ queryKey: ["following-count"] });
      toast({ title: "언팔로우했습니다." });
    },
  });

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
        .select("user_id, question_id, result")
        .gte("attempted_at", todayStart);
      return data ?? [];
    },
  });

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

  const { data: allAttempts } = useQuery({
    queryKey: ["ranking-all-attempts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("attempts")
        .select("user_id, question_id, attempted_at");
      return data ?? [];
    },
  });

  const { data: questions } = useQuery({
    queryKey: ["ranking-questions"],
    queryFn: async () => {
      const { data } = await supabase.from("questions").select("id, chapter_id");
      return data ?? [];
    },
  });

  const { data: chapters } = useQuery({
    queryKey: ["ranking-chapters"],
    queryFn: async () => {
      const { data } = await supabase.from("chapters").select("id, book_id");
      return data ?? [];
    },
  });

  // Real-time subscription: invalidate ranking queries when attempts change
  useEffect(() => {
    const channel = supabase
      .channel("ranking-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attempts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ranking-today-attempts"] });
          queryClient.invalidateQueries({ queryKey: ["ranking-all-attempts"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ranking-profiles"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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

  const allProfileMap = useMemo(() => {
    const m = new Map<string, NonNullable<typeof profiles>[number]>();
    profiles?.forEach((p) => m.set(p.id, p));
    return m;
  }, [profiles]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !profiles) return [];
    const q = searchQuery.trim().toLowerCase();
    return profiles
      .filter((p) => p.display_name.toLowerCase().includes(q) && p.id !== user?.id)
      .slice(0, 8);
  }, [searchQuery, profiles, user]);

  const { profile, setProfile } = useAuth();
  const isMePublic = profile?.is_public ?? false;

  const handleGoPublic = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ is_public: true })
      .eq("id", user.id);
    if (!error && profile) {
      setProfile({ ...profile, is_public: true });
      toast({ title: "프로필이 공개로 전환되었습니다." });
    }
  };

  // Unified ranking
  const generalRanking = useMemo(() => {
    if (sortBy === "today-count") {
      if (!todayAttempts) return [];
      const counts = new Map<string, number>();
      todayAttempts.forEach((a) => {
        if (profileMap.has(a.user_id)) counts.set(a.user_id, (counts.get(a.user_id) ?? 0) + 1);
      });
      return Array.from(counts.entries())
        .map(([userId, count]) => ({
          userId, name: profileMap.get(userId)?.display_name ?? "?",
          examStatus: profileMap.get(userId)?.exam_status ?? "",
          avatarUrl: (profileMap.get(userId) as any)?.avatar_url ?? null,
          value: count, label: `${count}문제`, isMe: userId === user?.id,
        }))
        .sort((a, b) => b.value - a.value);
    }
    if (sortBy === "total-count") {
      if (!allAttempts) return [];
      const counts = new Map<string, number>();
      allAttempts.forEach((a) => {
        if (profileMap.has(a.user_id)) counts.set(a.user_id, (counts.get(a.user_id) ?? 0) + 1);
      });
      return Array.from(counts.entries())
        .map(([userId, count]) => ({
          userId, name: profileMap.get(userId)?.display_name ?? "?",
          examStatus: profileMap.get(userId)?.exam_status ?? "",
          avatarUrl: (profileMap.get(userId) as any)?.avatar_url ?? null,
          value: count, label: `${count}문제`, isMe: userId === user?.id,
        }))
        .sort((a, b) => b.value - a.value);
    }
    if (sortBy === "today-correct") {
      if (!todayAttempts) return [];
      const stats = new Map<string, { correct: number; total: number }>();
      todayAttempts.forEach((a) => {
        if (profileMap.has(a.user_id)) {
          const s = stats.get(a.user_id) ?? { correct: 0, total: 0 };
          s.total++;
          if (a.result === "correct") s.correct++;
          stats.set(a.user_id, s);
        }
      });
      return Array.from(stats.entries())
        .filter(([, s]) => s.total >= 5)
        .map(([userId, s]) => {
          const pct = Math.round((s.correct / s.total) * 100);
          return {
            userId, name: profileMap.get(userId)?.display_name ?? "?",
            examStatus: profileMap.get(userId)?.exam_status ?? "",
            value: pct, label: `${pct}% (${s.correct}/${s.total})`, isMe: userId === user?.id,
          };
        })
        .sort((a, b) => b.value - a.value);
    }
    if (sortBy === "streak") {
      if (!allAttempts) return [];
      const userDates = new Map<string, Set<string>>();
      allAttempts.forEach((a) => {
        if (profileMap.has(a.user_id)) {
          if (!userDates.has(a.user_id)) userDates.set(a.user_id, new Set());
          userDates.get(a.user_id)!.add(a.attempted_at.slice(0, 10));
        }
      });
      const today = new Date();
      return Array.from(userDates.entries())
        .map(([userId, dates]) => {
          let streak = 0;
          const d = new Date(today);
          while (true) {
            const key = d.toISOString().slice(0, 10);
            if (dates.has(key)) { streak++; d.setDate(d.getDate() - 1); } else break;
          }
          return {
            userId, name: profileMap.get(userId)?.display_name ?? "?",
            examStatus: profileMap.get(userId)?.exam_status ?? "",
            value: streak, label: `${streak}일`, isMe: userId === user?.id,
          };
        })
        .filter((r) => r.value > 0)
        .sort((a, b) => b.value - a.value);
    }
    return [];
  }, [sortBy, todayAttempts, allAttempts, profileMap, user]);

  // Book ranking
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
        userId, name: profileMap.get(userId)?.display_name ?? "?",
        examStatus: profileMap.get(userId)?.exam_status ?? "",
        solved: qs.size, total: totalQ, pct: Math.round((qs.size / totalQ) * 100),
        isMe: userId === user?.id,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [allAttempts, selectedBook, questionToBook, questionsPerBook, profileMap, user]);

  const selectedProfile = selectedUserId ? allProfileMap.get(selectedUserId) : null;
  const isFollowing = myFollows?.has(selectedUserId ?? "") ?? false;
  const isMe = selectedUserId === user?.id;

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-4 w-4" style={{ color: "hsl(45 90% 50%)" }} />;
    if (rank === 1) return <span className="text-sm font-bold" style={{ color: "hsl(0 0% 65%)" }}>2</span>;
    if (rank === 2) return <span className="text-sm font-bold" style={{ color: "hsl(25 70% 50%)" }}>3</span>;
    return <span className="text-sm font-bold text-muted-foreground">{rank + 1}</span>;
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-8 pt-8 pb-24 md:pb-6 max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          랭킹
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          다른 수험생들과 풀이량을 비교하세요.
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="닉네임으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-border/60 bg-white text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-border transition-colors"
          />
          {searchResults.length > 0 && (
            <div
              className="absolute z-20 top-full mt-2 w-full rounded-2xl overflow-hidden bg-white"
              style={{ border: "1px solid hsl(0 0% 0% / 0.08)", boxShadow: "0 4px 20px hsl(0 0% 0% / 0.08)" }}
            >
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f9f9f9] transition-colors"
                  onClick={() => { setSelectedUserId(p.id); setSearchQuery(""); }}
                >
                  <div className="h-8 w-8 rounded-full bg-[#f4f4f5] flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.display_name}</p>
                    {p.exam_status && <p className="text-[10px] text-muted-foreground">{p.exam_status}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Group filter pills */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide">
          {EXAM_GROUPS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGroup(g.value)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                group === g.value
                  ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                  : "bg-transparent text-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setActiveTab("today")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              activeTab === "today"
                ? "bg-foreground text-white border-foreground"
                : "bg-transparent text-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
            )}
          >
            <Flame className="h-3.5 w-3.5" />
            오늘의 풀이왕
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              activeTab === "book"
                ? "bg-foreground text-white border-foreground"
                : "bg-transparent text-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            교재별
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "today" && (
            <>
              {/* Sort pills */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setSortBy(o.value)}
                    className={cn(
                      "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                      sortBy === o.value
                        ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                        : "bg-white text-[#555] border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
                    )}
                  >
                    <o.icon className="h-3 w-3" />
                    {o.label}
                  </button>
                ))}
              </div>

              {generalRanking.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  {sortBy === "today-correct" ? "오늘 5문제 이상 푼 사용자가 없습니다." : "풀이 기록이 없습니다."}
                </div>
              ) : (
                <div className="space-y-2">
                  {generalRanking.map((r, i) => (
                    <button
                      key={r.userId}
                      onClick={() => handleUserClick(r.userId)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl bg-white transition-all hover:shadow-sm text-left",
                        r.isMe && "ring-2 ring-[#DA77D1]/30"
                      )}
                      style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
                    >
                      <div className="w-8 flex items-center justify-center flex-shrink-0">
                        {getRankIcon(i)}
                      </div>
                      <div className="h-9 w-9 rounded-full bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {r.name}
                          {r.isMe && <span className="text-xs text-[#DA77D1] ml-1.5">(나)</span>}
                        </p>
                        {r.examStatus && <p className="text-[11px] text-muted-foreground">{r.examStatus}</p>}
                      </div>
                      <span className="text-sm font-bold text-foreground">{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "book" && (
            <>
              {/* Book select pills */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => setSelectedBook("all")}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                    selectedBook === "all"
                      ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                      : "bg-white text-[#555] border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
                  )}
                >
                  교재 선택
                </button>
                {books?.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBook(b.id)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap",
                      selectedBook === b.id
                        ? "bg-[#DA77D1] text-white border-[#DA77D1]"
                        : "bg-white text-[#555] border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
                    )}
                  >
                    {b.title}
                  </button>
                ))}
              </div>

              {selectedBook === "all" ? (
                <div className="text-center py-16 text-muted-foreground text-sm">교재를 선택해주세요.</div>
              ) : bookRanking.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">풀이 기록이 없습니다.</div>
              ) : (
                <div className="space-y-2">
                  {bookRanking.map((r, i) => (
                    <button
                      key={r.userId}
                      onClick={() => handleUserClick(r.userId)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl bg-white transition-all hover:shadow-sm text-left",
                        r.isMe && "ring-2 ring-[#DA77D1]/30"
                      )}
                      style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
                    >
                      <div className="w-8 flex items-center justify-center flex-shrink-0">
                        {getRankIcon(i)}
                      </div>
                      <div className="h-9 w-9 rounded-full bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {r.name}
                          {r.isMe && <span className="text-xs text-[#DA77D1] ml-1.5">(나)</span>}
                        </p>
                        {r.examStatus && <p className="text-[11px] text-muted-foreground">{r.examStatus}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-foreground">{r.pct}%</span>
                        <p className="text-[10px] text-muted-foreground">{r.solved}/{r.total}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User profile sheet - styled like /profile page */}
      <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <SheetContent side="bottom" className="max-h-[70vh] p-0 overflow-y-auto">
          {selectedProfile && (
            <PeerProfileCard
              profile={selectedProfile}
              isMe={isMe}
              isFollowing={isFollowing}
              onFollow={() => followMutation.mutate(selectedUserId!)}
              onUnfollow={() => unfollowMutation.mutate(selectedUserId!)}
              followPending={followMutation.isPending || unfollowMutation.isPending}
              onViewReview={() => {
                if (!isMePublic) {
                  toast({ title: "프로필 공개가 필요합니다", description: "회독표를 보려면 내 프로필을 공개로 전환해야 합니다." });
                  return;
                }
                setPeerReviewUserId(selectedUserId!);
                setPeerReviewName(selectedProfile?.display_name ?? "");
                setPeerReviewOpen(true);
                setSelectedUserId(null);
              }}
              isMePublic={isMePublic}
              userId={selectedUserId!}
            />
          )}
        </SheetContent>
      </Sheet>

      <PeerReviewSheet
        open={peerReviewOpen}
        onOpenChange={setPeerReviewOpen}
        peerName={peerReviewName}
        peerId={peerReviewUserId}
        isMePublic={isMePublic}
        onGoPublic={handleGoPublic}
      />
    </AppShell>
  );
}
