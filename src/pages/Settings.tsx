import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
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
import AppShell from "@/components/layout/AppShell";
import { User, Eye, Bell, LogOut } from "lucide-react";

export default function Settings() {
  const { user, profile, setProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [showPrivateWarning, setShowPrivateWarning] = useState(false);

  // Local-only notification prefs (DB 연동은 추후)
  const [studyReminder, setStudyReminder] = useState(true);
  const [peerActivity, setPeerActivity] = useState(true);

  useEffect(() => {
    if (profile) {
      setNickname(profile.display_name);
      setIsPublic(profile.is_public);
    }
  }, [profile]);

  const handleSaveNickname = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    if (trimmed.length > 20) {
      toast({ title: "닉네임은 20자 이하로 입력해주세요.", variant: "destructive" });
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
      toast({ title: "저장 실패", description: "다시 시도해주세요.", variant: "destructive" });
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
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24 md:pb-6">
        <h1 className="text-lg font-bold text-foreground">설정</h1>

        {/* 프로필 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">프로필</CardTitle>
            </div>
            <CardDescription className="text-xs">다른 수험생에게 보여질 닉네임</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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

        {/* 공개 설정 */}
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

        {/* 알림 설정 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">알림 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="study-reminder" className="text-sm cursor-pointer">
                학습 리마인더
              </Label>
              <Switch
                id="study-reminder"
                checked={studyReminder}
                onCheckedChange={setStudyReminder}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="peer-activity" className="text-sm cursor-pointer">
                동차생 활동 알림
              </Label>
              <Switch
                id="peer-activity"
                checked={peerActivity}
                onCheckedChange={setPeerActivity}
              />
            </div>
          </CardContent>
        </Card>

        {/* 계정 */}
        <Card>
          <CardContent className="pt-6">
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 비공개 전환 경고 */}
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
    </AppShell>
  );
}
