import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { Pencil, Eye, LogOut, Users, User, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAM_STATUSES = [
  { value: "초시생", label: "초시생" },
  { value: "동차생", label: "동차생" },
  { value: "유예생", label: "유예생" },
  { value: "N시생", label: "N시생" },
];

export default function Profile() {
  const { user, profile, setProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [showPrivateWarning, setShowPrivateWarning] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [examStatus, setExamStatus] = useState(profile?.exam_status ?? null);

  useEffect(() => {
    if (profile) {
      setNickname(profile.display_name);
      setIsPublic(profile.is_public);
      setExamStatus(profile.exam_status);
    }
  }, [profile]);

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
  const googleName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email;
  const displayName = profile?.display_name || googleName || "사용자";
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
        .select("id, display_name, exam_status")
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
        .select("id, display_name, exam_status")
        .in("id", ids);
      return profs ?? [];
    },
    enabled: !!user && showFollowing,
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
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
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

          {/* Exam status selector */}
          <div
            className="p-5 rounded-2xl bg-white transition-all"
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
            className="flex items-center gap-4 p-5 rounded-2xl bg-white transition-all hover:shadow-sm"
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

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white transition-all hover:shadow-sm text-left group"
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

      {/* Followers sheet */}
      <Sheet open={showFollowers} onOpenChange={setShowFollowers}>
        <SheetContent side="bottom" className="max-h-[60vh]">
          <SheetHeader>
            <SheetTitle className="text-sm">팔로워</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-2 overflow-y-auto">
            {followers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">팔로워가 없습니다.</p>
            ) : (
              followers.map((f) => (
                <div key={f.id} className="flex items-center gap-3 py-2 px-1">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.display_name}</p>
                    {f.exam_status && (
                      <p className="text-[10px] text-muted-foreground">{f.exam_status}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Following sheet */}
      <Sheet open={showFollowing} onOpenChange={setShowFollowing}>
        <SheetContent side="bottom" className="max-h-[60vh]">
          <SheetHeader>
            <SheetTitle className="text-sm">팔로잉</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-2 overflow-y-auto">
            {following.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">팔로잉이 없습니다.</p>
            ) : (
              following.map((f) => (
                <div key={f.id} className="flex items-center gap-3 py-2 px-1">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.display_name}</p>
                    {f.exam_status && (
                      <p className="text-[10px] text-muted-foreground">{f.exam_status}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
