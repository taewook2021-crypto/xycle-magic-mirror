import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, UserPlus, UserMinus, Eye, Lock } from "lucide-react";

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

  return (
    <div>
      {/* Banner */}
      <div
        className="h-24 sm:h-28"
        style={{
          background: "linear-gradient(135deg, #fbc2eb 0%, #f6d365 50%, #fda085 100%)",
        }}
      />

      {/* Profile info */}
      <div className="px-5 -mt-10 relative">
        <div className="flex items-end gap-4">
          <div className="h-20 w-20 rounded-full border-4 border-white bg-[#f4f4f5] flex-shrink-0 flex items-center justify-center overflow-hidden">
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

        {/* Follower / following */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{followerCount}</span>
            <span className="text-sm text-muted-foreground">팔로워</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{followingCount}</span>
            <span className="text-sm text-muted-foreground">팔로잉</span>
          </div>
        </div>

        {/* Action buttons */}
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
