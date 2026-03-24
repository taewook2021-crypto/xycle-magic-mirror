import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GroupMember } from "@/hooks/useStudyGroup";
import { User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  members: GroupMember[];
}

export default function GroupRanking({ members }: Props) {
  const { user } = useAuth();
  const memberIds = members.map((m) => m.user_id);

  const { data: ranking = [] } = useQuery({
    queryKey: ["group-ranking", memberIds.sort().join(",")],
    queryFn: async () => {
      if (!memberIds.length) return [];
      // Get attempt counts per user
      const { data } = await supabase
        .from("attempts")
        .select("user_id")
        .in("user_id", memberIds);
      
      const counts = new Map<string, number>();
      (data ?? []).forEach((a: any) => {
        counts.set(a.user_id, (counts.get(a.user_id) ?? 0) + 1);
      });

      return members
        .map((m) => ({
          userId: m.user_id,
          name: m.profile?.display_name ?? "사용자",
          avatarUrl: m.profile?.avatar_url,
          examStatus: m.profile?.exam_status,
          count: counts.get(m.user_id) ?? 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
    enabled: memberIds.length > 0,
  });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-2">
      {ranking.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">멤버가 없습니다.</p>
      ) : (
        ranking.map((r, i) => {
          const isMe = r.userId === user?.id;
          return (
            <div
              key={r.userId}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                isMe ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30"
              )}
            >
              <span className="w-8 text-center text-sm font-bold flex-shrink-0">
                {i < 3 ? medals[i] : `${i + 1}`}
              </span>
              <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                {r.avatarUrl ? (
                  <img src={r.avatarUrl} alt={r.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {r.name}{isMe && " (나)"}
                </p>
                {r.examStatus && (
                  <p className="text-[11px] text-muted-foreground">{r.examStatus}</p>
                )}
              </div>
              <span className="text-sm font-bold text-foreground tabular-nums">{r.count}문제</span>
            </div>
          );
        })
      )}
    </div>
  );
}
