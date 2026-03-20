import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

export type ReferralTier = 0 | 1 | 2;

export interface ReferralState {
  /** Unique referral code for this user */
  code: string;
  /** Number of successful invites */
  invitedCount: number;
  /** Current unlock tier */
  tier: ReferralTier;
  /** Tier descriptions */
  tiers: { tier: ReferralTier; label: string; description: string; unlocked: boolean }[];
  /** Copy referral link to clipboard */
  copyLink: () => Promise<void>;
}

/**
 * Mock referral hook — replace with Supabase integration later.
 * For now, invitedCount is stored in localStorage for demo purposes.
 */
export function useReferral(): ReferralState {
  const { user } = useAuth();

  const storageKey = `phonegaejang_invited_${user?.id ?? "anon"}`;
  const [invitedCount, setInvitedCount] = useState<number>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? parseInt(stored, 10) : 0;
  });

  // Generate a deterministic-ish code from user id
  const code = useMemo(() => {
    if (!user?.id) return "PGJ000";
    return "PG" + user.id.slice(0, 6).toUpperCase();
  }, [user?.id]);

  const tier: ReferralTier = invitedCount >= 2 ? 2 : invitedCount >= 1 ? 1 : 0;

  const tiers = useMemo(
    () => [
      {
        tier: 0 as ReferralTier,
        label: "기본",
        description: "내 등수 (상위 %)",
        unlocked: true,
      },
      {
        tier: 1 as ReferralTier,
        label: "1명 초대",
        description: "주간 등수 변동 추이",
        unlocked: invitedCount >= 1,
      },
      {
        tier: 2 as ReferralTier,
        label: "2명 초대",
        description: "파트별 세부 등수 + 상위권 닉네임",
        unlocked: invitedCount >= 2,
      },
    ],
    [invitedCount]
  );

  const copyLink = useCallback(async () => {
    const link = `${window.location.origin}/?ref=${code}`;
    await navigator.clipboard.writeText(link);
  }, [code]);

  return { code, invitedCount, tier, tiers, copyLink };
}
