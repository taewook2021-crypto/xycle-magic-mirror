import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { User, Eye, LogOut, Users } from "lucide-react";

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

  useEffect(() => {
    if (profile) {
      setNickname(profile.display_name);
      setIsPublic(profile.is_public);
    }
  }, [profile]);

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-5 pb-24 md:pb-6 space-y-4">
        <h1 className="text-lg font-bold text-foreground">프로필</h1>

        {/* Social stats */}
        <Card>
          <CardContent className="py-4 px-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{profile?.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  {(profile as any)?.exam_status ?? ""}
                </p>
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <button
                onClick={() => setShowFollowers(true)}
                className="text-center flex-1 hover:bg-accent/50 rounded-lg py-2 transition-colors"
              >
                <p className="text-lg font-bold text-foreground">{followerCount}</p>
                <p className="text-[11px] text-muted-foreground">팔로워</p>
              </button>
              <button
                onClick={() => setShowFollowing(true)}
                className="text-center flex-1 hover:bg-accent/50 rounded-lg py-2 transition-colors"
              >
                <p className="text-lg font-bold text-foreground">{followingCount}</p>
                <p className="text-[11px] text-muted-foreground">팔로잉</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Nickname */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">닉네임 변경</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="닉네임 입력"
                className="flex-1"
              />
              <Button
                onClick={handleSaveNickname}
                disabled={saving || nickname.trim() === profile?.display_name}
                size="sm"
              >
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Public toggle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">공개 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="public-toggle" className="text-sm cursor-pointer">
                내 학습 현황 공개
              </Label>
              <Switch
                id="public-toggle"
                checked={isPublic}
                onCheckedChange={handlePublicToggle}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              공개 시 다른 수험생이 나의 회독표와 상세 통계를 볼 수 있습니다.
            </p>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
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
