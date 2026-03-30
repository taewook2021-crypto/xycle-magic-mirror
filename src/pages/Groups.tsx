import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { usePublicGroups, useJoinGroupById, useMyGroups } from "@/hooks/useStudyGroup";
import { ArrowLeft, Search, Users, UserPlus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Groups() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: publicGroups = [], isLoading } = usePublicGroups(search);
  const { data: myGroups = [] } = useMyGroups();
  const joinById = useJoinGroupById();

  const myGroupIds = new Set(myGroups.map((g) => g.id));
  const atLimit = myGroups.length >= 3;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto pb-24 md:pb-6">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">스터디 그룹 찾기</h1>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="그룹 이름으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          {atLimit && (
            <p className="text-[11px] text-muted-foreground mt-2">
              최대 3개 그룹까지 가입할 수 있습니다. 다른 그룹을 탈퇴하면 가입할 수 있어요.
            </p>
          )}
        </div>

        {/* List */}
        <div className="px-4 sm:px-6 space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-10">불러오는 중…</p>
          ) : publicGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              {search ? "검색 결과가 없습니다." : "공개 그룹이 아직 없습니다."}
            </p>
          ) : (
            publicGroups.map((g) => {
              const isMember = myGroupIds.has(g.id);
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{g.name}</p>
                    {g.description && (
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{g.description}</p>
                    )}
                  </div>
                  {isMember ? (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-medium text-primary flex-shrink-0">
                      <Check className="h-3.5 w-3.5" />
                      가입됨
                    </span>
                  ) : (
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
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
