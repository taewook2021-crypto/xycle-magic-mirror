import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReferralTier } from "@/hooks/useReferral";

interface LockedInsightProps {
  /** Minimum tier required to view this content */
  requiredTier: ReferralTier;
  /** Current user tier */
  currentTier: ReferralTier;
  /** Label shown on the lock overlay */
  unlockLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export default function LockedInsight({
  requiredTier,
  currentTier,
  unlockLabel,
  children,
  className,
}: LockedInsightProps) {
  const isLocked = currentTier < requiredTier;

  if (!isLocked) return <>{children}</>;

  const tierLabel = requiredTier === 1 ? "1명 초대" : "2명 초대";

  return (
    <div className={cn("relative", className)}>
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="blur-[6px] opacity-50">{children}</div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-background/60 backdrop-blur-[2px] rounded-lg">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground">
          {unlockLabel ?? `${tierLabel}로 해금`}
        </span>
      </div>
    </div>
  );
}
