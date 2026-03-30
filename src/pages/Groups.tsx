import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { usePublicGroups, useJoinGroupById, useMyGroups, StudyGroup } from "@/hooks/useStudyGroup";
import { ArrowLeft, Search, Users, UserPlus, Check, ChevronRight, Plus, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import CreateGroupSheet from "@/components/group/CreateGroupSheet";
import JoinGroupSheet from "@/components/group/JoinGroupSheet";

const MAX_GROUPS = 3;

export default function Groups() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: publicGroups = [], isLoading: loadingPublic } = usePublicGroups(search);
  const { data: myGroups = [], isLoading: loadingMy } = useMyGroups();
  const joinById = useJoinGroupById();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const myGroupIds = new Set(myGroups.map((g) => g.id));
  const atLimit = myGroups.length >= MAX_GROUPS;

  // Merge: my groups first, then public groups I haven't joined
  const publicNotJoined = publicGroups.filter((g) => !myGroupIds.has(g.id));

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto pb-24 md:pb-6">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3">
          <h1 className="text-lg font-bold text-foreground">스터디</h1>
          <p className="text-xs text-muted-foreground mt-0.5">그룹에서 함께 공부하세요</p>
        </div>

        {/* My Groups */}
        <div className="px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">내 그룹</p>
            <span className="text-xs text-muted-foreground">{myGroups.length}/{MAX_GROUPS}</span>
          </div>

          {loadingMy ? (
            <p className="text-xs text-muted-foreground text-center py-6">불러오는 중…</p>
          ) : myGroups.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">가입한 그룹이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {myGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => navigate(`/group/${g.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{g.name}</p>
                    {(g as any).description && (
                      <p className="text-[11px] text-muted-foreground truncate">{(g as any).description}</p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          {!atLimit && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setCreateOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors text-foreground"
              >
                <Plus className="h-4 w-4" />
                만들기
              </button>
              <button
                onClick={() => setJoinOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors text-foreground"
              >
                <KeyRound className="h-4 w-4" />
                코드로 가입
              </button>
            </div>
          )}
        </div>

        {/* Public Groups */}
        <div className="px-4 sm:px-6">
          <p className="text-sm font-semibold text-foreground mb-3">공개 그룹</p>

          <div className="space-y-2">
            {loadingPublic ? (
              <p className="text-xs text-muted-foreground text-center py-6">불러오는 중…</p>
            ) : publicNotJoined.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                {search ? "검색 결과가 없습니다." : "새로운 공개 그룹이 없습니다."}
              </p>
            ) : (
              publicNotJoined.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                >
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{g.name}</p>
                    {g.description && (
                      <p className="text-[11px] text-muted-foreground truncate">{g.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => joinById.mutate(g.id)}
                    disabled={atLimit || joinById.isPending}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0",
                      atLimit
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    가입
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CreateGroupSheet open={createOpen} onOpenChange={setCreateOpen} />
      <JoinGroupSheet open={joinOpen} onOpenChange={setJoinOpen} />
    </AppShell>
  );
}
