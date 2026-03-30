import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PeerProfileCard from "@/components/ranking/PeerProfileCard";
import PeerReviewSheet from "@/components/dashboard/PeerReviewSheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Eye, LogOut, Users, User, GraduationCap, ShieldCheck, MessageCircle, StickyNote, Trash2, ChevronDown } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import GroupCard from "@/components/group/GroupCard";
import { cn } from "@/lib/utils";

const EXAM_STATUSES = [
  { value: "초시생", label: "초시생" },
  { value: "동차생", label: "동차생" },
  { value: "유예생", label: "유예생" },
  { value: "N시생", label: "N시생" },
];

function MyMemosCard({ userId }: { userId?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const { data: memos = [], isLoading } = useQuery({
    queryKey: ["my-memos", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_question_memos")
        .select("id, content, question_id, updated_at")
        .eq("user_id", userId!)
        .order("updated_at", { ascending: false });
      if (error || !data?.length) return [];

      const questionIds = data.map((m) => m.question_id);
      const { data: questions } = await supabase
        .from("questions")
        .select("id, question_number, chapter_id")
        .in("id", questionIds);

      const chapterIds = [...new Set(questions?.map((q) => q.chapter_id) ?? [])];
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id, chapter_number, title, book_id")
        .in("id", chapterIds);

      const bookIds = [...new Set(chapters?.map((c) => c.book_id) ?? [])];
      const { data: books } = await supabase
        .from("books")
        .select("id, title")
        .in("id", bookIds);

      const qMap = new Map(questions?.map((q) => [q.id, q]) ?? []);
      const cMap = new Map(chapters?.map((c) => [c.id, c]) ?? []);
      const bMap = new Map(books?.map((b) => [b.id, b]) ?? []);

      return data.map((m) => {
        const q = qMap.get(m.question_id);
        const c = q ? cMap.get(q.chapter_id) : undefined;
        const b = c ? bMap.get(c.book_id) : undefined;
        return {
          ...m,
          question_number: q?.question_number,
          chapter_number: c?.chapter_number,
          chapter_title: c?.title,
          book_id: c?.book_id,
          book_title: b?.title,
        };
      });
    },
    enabled: !!userId,
  });

  const deleteMemo = async (memoId: string) => {
    await supabase.from("user_question_memos").delete().eq("id", memoId);
    queryClient.invalidateQueries({ queryKey: ["my-memos"] });
    toast({ title: "메모가 삭제되었습니다." });
  };

  return (
    <div
      className="rounded-2xl bg-card transition-all"
      style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div className="h-10 w-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
          <StickyNote className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">내 메모</p>
            {memos.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                {memos.length}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            모든 교재의 메모를 한 곳에서 확인합니다.
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-1">
          {isLoading ? (
            <p className="text-xs text-muted-foreground text-center py-4">불러오는 중…</p>
          ) : memos.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">작성한 메모가 없습니다.</p>
          ) : (
            memos.map((m: any) => (
              <div
                key={m.id}
                className="flex items-start gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => m.book_id && navigate(`/review/${m.book_id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground truncate">
                    {m.book_title} &gt; Ch.{m.chapter_number} 문제{m.question_number}
                  </p>
                  <p className="text-sm text-foreground truncate mt-0.5">{m.content}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMemo(m.id); }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all shrink-0 mt-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, profile, setProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [showPrivateWarning, setShowPrivateWarning] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [peerReviewOpen, setPeerReviewOpen] = useState(false);
  const [peerReviewUserId, setPeerReviewUserId] = useState("");
  const [peerReviewName, setPeerReviewName] = useState("");

  const [examStatus, setExamStatus] = useState(profile?.exam_status ?? null);

  useEffect(() => {
    if (profile) {
      setNickname(profile.display_name);
      setIsPublic(profile.is_public);
      setExamStatus(profile.exam_status);
    }
  }, [profile]);

  // Avatar photos hidden for anonymity — always show default icon
  const displayName = (profile?.display_name && profile.display_name !== "사용자") ? profile.display_name : "사용자";
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })
    : "";

  // Follower / following counts
  const { data: followerCount = 0 } = useQuery({
    queryKey: ["follower-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ["following-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  // Follower list
  const { data: followers = [] } = useQuery({
    queryKey: ["followers-list", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("following_id", user!.id);
      if (!data?.length) return [];
      const ids = data.map((f) => f.follower_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, avatar_url, is_public")
        .in("id", ids);
      return profs ?? [];
    },
    enabled: !!user && showFollowers,
  });

  // Following list
  const { data: following = [] } = useQuery({
    queryKey: ["following-list", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user!.id);
      if (!data?.length) return [];
      const ids = data.map((f) => f.following_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, avatar_url, is_public")
        .in("id", ids);
      return profs ?? [];
    },
    enabled: !!user && showFollowing,
  });

  // My follows for checking isFollowing in nested profile card
  const { data: myFollows = [] } = useQuery({
    queryKey: ["profile-my-follows", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user!.id);
      return data?.map((f) => f.following_id) ?? [];
    },
    enabled: !!user,
  });

  // Selected user profile for nested dialog
  const { data: selectedProfile } = useQuery({
    queryKey: ["peer-profile", selectedUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, exam_status, avatar_url, is_public")
        .eq("id", selectedUserId!)
        .single();
      return data;
    },
    enabled: !!selectedUserId,
  });

  const followMutation = useMutation({
    mutationFn: async (targetId: string) => {
      await supabase.from("follows").insert({ follower_id: user!.id, following_id: targetId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-my-follows"] });
      queryClient.invalidateQueries({ queryKey: ["ranking-my-follows"] });
      queryClient.invalidateQueries({ queryKey: ["follower-count"] });
      queryClient.invalidateQueries({ queryKey: ["following-count"] });
      queryClient.invalidateQueries({ queryKey: ["followers-list"] });
      queryClient.invalidateQueries({ queryKey: ["following-list"] });
      toast({ title: "팔로우했습니다." });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (targetId: string) => {
      await supabase.from("follows").delete().eq("follower_id", user!.id).eq("following_id", targetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-my-follows"] });
      queryClient.invalidateQueries({ queryKey: ["ranking-my-follows"] });
      queryClient.invalidateQueries({ queryKey: ["follower-count"] });
      queryClient.invalidateQueries({ queryKey: ["following-count"] });
      queryClient.invalidateQueries({ queryKey: ["followers-list"] });
      queryClient.invalidateQueries({ queryKey: ["following-list"] });
      toast({ title: "언팔로우했습니다." });
    },
  });

  const handleSaveNickname = async () => {
    const trimmed = nickname.trim();
    if (!trimmed || trimmed.length > 20) {
      toast({ title: "닉네임은 1~20자로 입력해주세요.", variant: "destructive" });
      return;
    }
    if (trimmed === profile?.display_name) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmed })
      .eq("id", user!.id);

    setSaving(false);
    if (error) {
      toast({ title: "저장 실패", variant: "destructive" });
    } else {
      setProfile({ ...profile!, display_name: trimmed });
      toast({ title: "닉네임이 변경되었습니다." });
    }
  };

  const handlePublicToggle = (checked: boolean) => {
    if (!checked) {
      setShowPrivateWarning(true);
    } else {
      updatePublic(true);
    }
  };

  const updatePublic = async (value: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_public: value })
      .eq("id", user!.id);

    if (error) {
      toast({ title: "설정 변경 실패", variant: "destructive" });
    } else {
      setIsPublic(value);
      setProfile({ ...profile!, is_public: value });
      toast({ title: value ? "프로필이 공개로 전환되었습니다." : "프로필이 비공개로 전환되었습니다." });
    }
  };

  const handleExamStatus = async (value: string) => {
    const newStatus = value === examStatus ? null : value;
    const { error } = await supabase
      .from("profiles")
      .update({ exam_status: newStatus })
      .eq("id", user!.id);
    if (error) {
      toast({ title: "저장 실패", variant: "destructive" });
    } else {
      setExamStatus(newStatus);
      setProfile({ ...profile!, exam_status: newStatus });
      toast({ title: newStatus ? `${newStatus}으로 설정되었습니다.` : "수험 상태가 해제되었습니다." });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto pb-24 md:pb-6">
        {/* Hero banner */}
        <div
          className="h-36 sm:h-48 rounded-b-2xl"
          style={{
            background: "linear-gradient(135deg, #fbc2eb 0%, #f6d365 50%, #fda085 100%)",
          }}
        />

        {/* Profile header */}
        <div className="px-4 sm:px-6 -mt-12 sm:-mt-14 relative">
          <div className="flex items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white bg-[#f4f4f5] flex-shrink-0 overflow-hidden">
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            {/* Name & meta */}
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {displayName}
                </h1>
                {examStatus && (
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                    {examStatus}
                  </span>
                )}
              </div>
              {joinedDate && (
                <p className="text-xs text-muted-foreground mt-0.5">Joined {joinedDate}</p>
              )}
            </div>
          </div>

          {/* Follower / following row */}
          <div className="flex items-center gap-6 mt-5">
            <button
              onClick={() => setShowFollowers(true)}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <span className="text-sm font-bold text-foreground">{followerCount}</span>
              <span className="text-sm text-muted-foreground">팔로워</span>
            </button>
            <button
              onClick={() => setShowFollowing(true)}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <span className="text-sm font-bold text-foreground">{followingCount}</span>
              <span className="text-sm text-muted-foreground">팔로잉</span>
            </button>
          </div>
        </div>

        {/* Settings cards */}
        <div className="px-4 sm:px-6 mt-8 space-y-4">

          {/* Nickname editor */}
          <div
            className="p-5 rounded-2xl bg-card transition-all"
            style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
                <Pencil className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">닉네임</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  다른 수험생에게 보이는 이름입니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="닉네임 입력"
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleSaveNickname}
                disabled={saving || nickname.trim() === profile?.display_name}
              >
                {saving ? "저장 중…" : "저장"}
              </Button>
            </div>
          </div>

          {/* Exam status selector */}
          <div
            className="p-5 rounded-2xl bg-card transition-all"
            style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">수험 상태</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  랭킹에서 같은 그룹끼리 비교할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {EXAM_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleExamStatus(s.value)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                    examStatus === s.value
                      ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                      : "bg-transparent text-foreground border-[hsl(0,0%,0%,0.1)] hover:bg-[#f9f9f9]"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex items-center gap-4 p-5 rounded-2xl bg-card transition-all hover:shadow-sm"
            style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
          >
            <div className="h-10 w-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">공개 설정</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                공개 시 다른 수험생이 나의 회독표와 상세 통계를 볼 수 있습니다.
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={handlePublicToggle}
            />
          </div>

          {/* My memos */}
          <MyMemosCard userId={user?.id} />

          {/* Dark mode toggle */}
          <DarkModeToggle />

          {/* Study groups */}
          <GroupCard />

          {/* Admin link - only for wiserlab1@gmail.com */}
          {user?.email === "wiserlab1@gmail.com" && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card transition-all hover:shadow-sm text-left group"
              style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
            >
              <div className="h-10 w-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">관리자 페이지</p>
                <p className="text-xs text-muted-foreground mt-0.5">유저 목록 및 회독표 관리</p>
              </div>
            </button>
          )}

          {/* KakaoTalk */}
          <a
            href="https://pf.kakao.com/_uSAyn"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card transition-all hover:shadow-sm text-left group no-underline"
            style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
          >
            <div className="h-10 w-10 rounded-xl bg-[#FEE500] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-[#3C1E1E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">카카오톡 문의</p>
              <p className="text-xs text-muted-foreground mt-0.5">분개장 카카오톡 채널로 문의하기</p>
            </div>
          </a>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card transition-all hover:shadow-sm text-left group"
            style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
          >
            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-red-600 transition-colors">로그아웃</p>
              <p className="text-xs text-muted-foreground mt-0.5">계정에서 로그아웃합니다.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Private warning dialog */}
      <AlertDialog open={showPrivateWarning} onOpenChange={setShowPrivateWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">비공개로 전환하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              비공개로 전환하면 다른 수험생의 회독표와 상세 통계를 열람할 수 없게 됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => updatePublic(false)}>전환</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Followers dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="p-0 overflow-hidden rounded-2xl border-0 shadow-[0_25px_60px_-15px_hsl(0,0%,0%,0.25)] max-w-sm w-[calc(100%-2rem)] sm:w-full">
          <div className="p-5 pb-2 border-b border-border">
            <h3 className="text-base font-bold text-foreground">팔로워</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{followerCount}명</p>
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {followers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">팔로워가 없습니다.</p>
            ) : (
              followers.map((f: any) => (
                <button
                  key={f.id}
                  onClick={() => { setShowFollowers(false); setSelectedUserId(f.id); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{f.display_name}</p>
                    {f.exam_status && (
                      <p className="text-[11px] text-muted-foreground">{f.exam_status}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="p-0 overflow-hidden rounded-2xl border-0 shadow-[0_25px_60px_-15px_hsl(0,0%,0%,0.25)] max-w-sm w-[calc(100%-2rem)] sm:w-full">
          <div className="p-5 pb-2 border-b border-border">
            <h3 className="text-base font-bold text-foreground">팔로잉</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{followingCount}명</p>
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {following.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">팔로잉이 없습니다.</p>
            ) : (
              following.map((f: any) => (
                <button
                  key={f.id}
                  onClick={() => { setShowFollowing(false); setSelectedUserId(f.id); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{f.display_name}</p>
                    {f.exam_status && (
                      <p className="text-[11px] text-muted-foreground">{f.exam_status}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Peer profile card dialog */}
      <Dialog open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <DialogContent className="p-0 overflow-hidden rounded-2xl border-0 shadow-[0_25px_60px_-15px_hsl(0,0%,0%,0.25)] max-w-md w-[calc(100%-2rem)] sm:w-full">
          {selectedProfile && (
            <PeerProfileCard
              profile={selectedProfile}
              isMe={selectedUserId === user?.id}
              isFollowing={myFollows.includes(selectedUserId!)}
              onFollow={() => followMutation.mutate(selectedUserId!)}
              onUnfollow={() => unfollowMutation.mutate(selectedUserId!)}
              followPending={followMutation.isPending || unfollowMutation.isPending}
              onViewReview={() => {
                if (!isPublic) {
                  toast({ title: "프로필 공개가 필요합니다", description: "회독표를 보려면 내 프로필을 공개로 전환해야 합니다." });
                  return;
                }
                setPeerReviewUserId(selectedUserId!);
                setPeerReviewName(selectedProfile.display_name);
                setPeerReviewOpen(true);
                setSelectedUserId(null);
              }}
              isMePublic={isPublic}
              userId={selectedUserId!}
            />
          )}
        </DialogContent>
      </Dialog>

      <PeerReviewSheet
        open={peerReviewOpen}
        onOpenChange={setPeerReviewOpen}
        peerName={peerReviewName}
        peerId={peerReviewUserId}
        isMePublic={isPublic}
        onGoPublic={() => updatePublic(true)}
      />
    </AppShell>
  );
}
