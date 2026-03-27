import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, UserPlus, UserMinus, Eye, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface PeerProfileCardProps {
  profile: {
    id: string;
    display_name: string;
    exam_status: string | null;
    is_public: boolean;
    avatar_url?: string | null;
  };
  isMe: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  followPending: boolean;
  onViewReview: () => void;
  isMePublic: boolean;
  userId: string;
}

export default function PeerProfileCard({
  profile,
  isMe,
  isFollowing,
  onFollow,
  onUnfollow,
  followPending,
  onViewReview,
  isMePublic,
  userId,
}: PeerProfileCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: followerCount = 0 } = useQuery({
    queryKey: ["peer-follower-count", userId],
    queryFn: async () => {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);
      return count ?? 0;
    },
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ["peer-following-count", userId],
    queryFn: async () => {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);
      return count ?? 0;
    },
  });

  const { data: kudosCount = 0 } = useQuery({
    queryKey: ["peer-kudos-count", userId],
    queryFn: async () => {
      const { count } = await supabase
        .from("kudos")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", userId);
      return count ?? 0;
    },
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: alreadySentToday = false } = useQuery({
    queryKey: ["kudos-sent-today", user?.id, userId, todayStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("kudos")
        .select("id")
        .eq("sender_id", user!.id)
        .eq("receiver_id", userId)
        .eq("created_date", todayStr)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !isMe,
  });

  const kudosMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("kudos")
        .insert({ sender_id: user!.id, receiver_id: userId, created_date: todayStr });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peer-kudos-count", userId] });
      queryClient.invalidateQueries({ queryKey: ["kudos-sent-today", user?.id, userId] });
      queryClient.invalidateQueries({ queryKey: ["ranking-kudos"] });
      toast({ title: `${profile.display_name}님에게 응원을 보냈습니다 👏` });
    },
    onError: () => {
      toast({ title: "이미 오늘 응원을 보냈습니다." });
    },
  });

  return (
    <div>
      <div
        className="h-24 sm:h-28"
        style={{
          background: "linear-gradient(135deg, #fbc2eb 0%, #f6d365 50%, #fda085 100%)",
        }}
      />

      <div className="px-5 -mt-10 relative">
        <div className="flex items-end gap-4">
          <div className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-foreground truncate">
                {profile.display_name}
              </p>
              {profile.exam_status && (
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                  {profile.exam_status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{followerCount}</span>
            <span className="text-sm text-muted-foreground">팔로워</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{followingCount}</span>
            <span className="text-sm text-muted-foreground">팔로잉</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">👏 {kudosCount}</span>
            <span className="text-sm text-muted-foreground">응원</span>
          </div>
        </div>

        {!isMe && (
          <div className="flex gap-2 mt-5 pb-5">
            <Button
              variant={isFollowing ? "outline" : "default"}
              className="flex-1 rounded-xl"
              onClick={isFollowing ? onUnfollow : onFollow}
              disabled={followPending}
            >
              {isFollowing ? (
                <><UserMinus className="h-4 w-4 mr-2" />언팔로우</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" />팔로우</>
              )}
            </Button>
            <Button
              variant={alreadySentToday ? "secondary" : "outline"}
              className="rounded-xl"
              onClick={() => kudosMutation.mutate()}
              disabled={alreadySentToday || kudosMutation.isPending}
            >
              👏 {alreadySentToday ? "응원함" : "응원"}
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={onViewReview}
            >
              {!isMePublic && <Lock className="h-3.5 w-3.5 mr-1" />}
              <Eye className="h-4 w-4 mr-1" />
              회독표
            </Button>
          </div>
        )}
        {isMe && <div className="pb-5" />}
      </div>
    </div>
  );
}
