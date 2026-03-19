import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Flame, BookOpen, User, UserPlus, UserMinus, Target, Hash, CheckCircle, Calendar, Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import PeerReviewSheet from "@/components/dashboard/PeerReviewSheet";

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
        .select("id, display_name, exam_status, is_public")
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
        .select("user_id, question_id, result")
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

  // All profiles map (unfiltered) for sheet lookup
  const allProfileMap = useMemo(() => {
    const m = new Map<string, NonNullable<typeof profiles>[number]>();
    profiles?.forEach((p) => m.set(p.id, p));
    return m;
  }, [profiles]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !profiles) return [];
    const q = searchQuery.trim().toLowerCase();
    return profiles
      .filter((p) => p.display_name.toLowerCase().includes(q) && p.id !== user?.id)
      .slice(0, 8);
  }, [searchQuery, profiles, user]);

  const { profile } = useAuth();
  const isMePublic = profile?.is_public ?? false;

  // Unified ranking based on sortBy
  const generalRanking = useMemo(() => {
    if (sortBy === "today-count") {
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
          value: count,
          label: `${count}문제`,
          isMe: userId === user?.id,
        }))
        .sort((a, b) => b.value - a.value);
    }

    if (sortBy === "total-count") {
      if (!allAttempts) return [];
      const counts = new Map<string, number>();
      allAttempts.forEach((a) => {
        if (profileMap.has(a.user_id)) {
          counts.set(a.user_id, (counts.get(a.user_id) ?? 0) + 1);
        }
      });
      return Array.from(counts.entries())
        .map(([userId, count]) => ({
          userId,
          name: profileMap.get(userId)?.display_name ?? "?",
          examStatus: profileMap.get(userId)?.exam_status ?? "",
          value: count,
          label: `${count}문제`,
          isMe: userId === user?.id,
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
            userId,
            name: profileMap.get(userId)?.display_name ?? "?",
            examStatus: profileMap.get(userId)?.exam_status ?? "",
            value: pct,
            label: `${pct}% (${s.correct}/${s.total})`,
            isMe: userId === user?.id,
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
            if (dates.has(key)) {
              streak++;
              d.setDate(d.getDate() - 1);
            } else {
              break;
            }
          }
          return {
            userId,
            name: profileMap.get(userId)?.display_name ?? "?",
            examStatus: profileMap.get(userId)?.exam_status ?? "",
            value: streak,
            label: `${streak}일`,
            isMe: userId === user?.id,
          };
        })
        .filter((r) => r.value > 0)
        .sort((a, b) => b.value - a.value);
    }

    return [];
  }, [sortBy, todayAttempts, allAttempts, profileMap, user]);

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

  // Selected user for sheet
  const selectedProfile = selectedUserId ? allProfileMap.get(selectedUserId) : null;
  const isFollowing = myFollows?.has(selectedUserId ?? "") ?? false;
  const isMe = selectedUserId === user?.id;

  const handleUserClick = (userId: string) => {
    if (userId !== user?.id) {
      setSelectedUserId(userId);
    }
  };

  // Rank card renderer
  const RankCard = ({ userId, rank, isMe: cardIsMe, children }: {
    userId: string;
    rank: number;
    isMe: boolean;
    children: React.ReactNode;
  }) => (
    <Card
      className={cn(
        cardIsMe ? "ring-1 ring-primary" : "cursor-pointer hover:bg-accent/30 transition-colors",
      )}
      onClick={() => handleUserClick(userId)}
    >
      <CardContent className="flex items-center gap-3 py-3 px-4">
        <span className={cn(
          "w-6 text-center font-bold text-sm",
          rank === 0 && "text-yellow-500",
          rank === 1 && "text-gray-400",
          rank === 2 && "text-amber-600",
          rank > 2 && "text-muted-foreground"
        )}>
          {rank === 0 ? <Trophy className="h-4 w-4 mx-auto text-yellow-500" /> : rank + 1}
        </span>
        {children}
      </CardContent>
    </Card>
  );

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

        {/* User search */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="닉네임으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute z-20 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors"
                  onClick={() => {
                    setSelectedUserId(p.id);
                    setSearchQuery("");
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.display_name}</p>
                    {p.exam_status && (
                      <p className="text-[10px] text-muted-foreground">{p.exam_status}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-xs">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {generalRanking.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {sortBy === "today-correct" ? "오늘 5문제 이상 푼 사용자가 없습니다." : "풀이 기록이 없습니다."}
              </p>
            ) : (
              generalRanking.map((r, i) => (
                <RankCard key={r.userId} userId={r.userId} rank={i} isMe={r.isMe}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {r.name}
                      {r.isMe && <span className="text-xs text-primary ml-1">(나)</span>}
                    </p>
                    {r.examStatus && (
                      <span className="text-[10px] text-muted-foreground">{r.examStatus}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{r.label}</span>
                </RankCard>
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
                <RankCard key={r.userId} userId={r.userId} rank={i} isMe={r.isMe}>
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
                </RankCard>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* User profile sheet */}
      <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <SheetContent side="bottom" className="max-h-[50vh]">
          <SheetHeader>
            <SheetTitle className="text-sm">프로필</SheetTitle>
          </SheetHeader>
          {selectedProfile && (
            <div className="mt-4 space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground truncate">
                    {selectedProfile.display_name}
                  </p>
                  {selectedProfile.exam_status && (
                    <p className="text-xs text-muted-foreground">{selectedProfile.exam_status}</p>
                  )}
                </div>
              </div>

              {!isMe && (
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    className="flex-1"
                    onClick={() => {
                      if (isFollowing) {
                        unfollowMutation.mutate(selectedUserId!);
                      } else {
                        followMutation.mutate(selectedUserId!);
                      }
                    }}
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        언팔로우
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        팔로우
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPeerReviewUserId(selectedUserId!);
                      setPeerReviewName(selectedProfile?.display_name ?? "");
                      setPeerReviewOpen(true);
                      setSelectedUserId(null);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    회독표
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Peer review sheet */}
      <PeerReviewSheet
        open={peerReviewOpen}
        onOpenChange={setPeerReviewOpen}
        peerName={peerReviewName}
        peerId={peerReviewUserId}
        isMePublic={isMePublic}
      />
    </AppShell>
  );
}
