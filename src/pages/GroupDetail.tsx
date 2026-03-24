import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { useGroupDetail, useGroupMembers, useLeaveGroup, useDeleteGroup } from "@/hooks/useStudyGroup";
import { useAuth } from "@/hooks/useAuth";
import GroupRanking from "@/components/group/GroupRanking";
import GroupProgress from "@/components/group/GroupProgress";
import GroupFeed from "@/components/group/GroupFeed";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Copy, LogOut, Trophy, BarChart3, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "ranking", label: "랭킹", icon: Trophy },
  { key: "feed", label: "피드", icon: Activity },
  { key: "progress", label: "진도", icon: BarChart3 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: group } = useGroupDetail(id);
  const { data: members = [] } = useGroupMembers(id);
  const leave = useLeaveGroup();
  const [tab, setTab] = useState<TabKey>("ranking");
  const [showLeave, setShowLeave] = useState(false);

  const isOwner = group?.owner_id === user?.id;

  const copyCode = () => {
    if (group?.invite_code) {
      navigator.clipboard.writeText(group.invite_code);
      toast({ title: "초대 코드가 복사되었습니다." });
    }
  };

  const handleLeave = () => {
    if (!id) return;
    leave.mutate(id, {
      onSuccess: () => navigate("/profile"),
    });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto pb-24 md:pb-6">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3 flex items-center gap-3">
          <button onClick={() => navigate("/profile")} className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {group?.name ?? "그룹"}
            </h1>
            <p className="text-xs text-muted-foreground">{members.length}명</p>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-mono font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            {group?.invite_code ?? "..."}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 flex gap-1 border-b border-border">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-4 sm:px-6 mt-4">
          {tab === "ranking" && <GroupRanking members={members} />}
          {tab === "feed" && <GroupFeed members={members} />}
          {tab === "progress" && <GroupProgress members={members} />}
        </div>

        {/* Leave button */}
        <div className="px-4 sm:px-6 mt-8">
          <button
            onClick={() => setShowLeave(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {isOwner ? "그룹 삭제" : "그룹 탈퇴"}
          </button>
        </div>
      </div>

      <AlertDialog open={showLeave} onOpenChange={setShowLeave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              {isOwner ? "그룹을 삭제하시겠습니까?" : "그룹에서 탈퇴하시겠습니까?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {isOwner
                ? "그룹을 삭제하면 모든 멤버가 자동으로 탈퇴됩니다."
                : "탈퇴 후에도 초대 코드로 다시 가입할 수 있습니다."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>
              {isOwner ? "삭제" : "탈퇴"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
