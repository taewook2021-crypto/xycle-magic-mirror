import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, KeyRound, ChevronRight } from "lucide-react";
import { useMyGroups, StudyGroup } from "@/hooks/useStudyGroup";
import CreateGroupSheet from "./CreateGroupSheet";
import JoinGroupSheet from "./JoinGroupSheet";

const MAX_GROUPS = 3;

export default function GroupCard() {
  const { data: groups = [], isLoading } = useMyGroups();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <>
      <div
        className="p-5 rounded-2xl bg-card transition-all"
        style={{ border: "1px solid hsl(0 0% 0% / 0.08)" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">스터디 그룹</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              초대 코드로 그룹에 가입하고 함께 공부하세요.
            </p>
          </div>
        </div>

        {/* Group list */}
        {isLoading ? (
          <div className="py-4 text-center text-xs text-muted-foreground">불러오는 중…</div>
        ) : groups.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            가입한 그룹이 없습니다.
          </div>
        ) : (
          <div className="space-y-2 mb-3">
            {groups.map((g: StudyGroup) => (
              <button
                key={g.id}
                onClick={() => navigate(`/group/${g.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground truncate flex-1">
                  {g.name}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {groups.length < MAX_GROUPS && (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors text-foreground"
            >
              <Plus className="h-4 w-4" />
              만들기
            </button>
          )}
          {groups.length < MAX_GROUPS && (
            <button
              onClick={() => setJoinOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors text-foreground"
            >
              <KeyRound className="h-4 w-4" />
              코드로 가입
            </button>
          )}
        </div>
      </div>

      <CreateGroupSheet open={createOpen} onOpenChange={setCreateOpen} />
      <JoinGroupSheet open={joinOpen} onOpenChange={setJoinOpen} />
    </>
  );
}
