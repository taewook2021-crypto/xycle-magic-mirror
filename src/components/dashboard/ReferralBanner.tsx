import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Gift, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReferralState } from "@/hooks/useReferral";

interface ReferralBannerProps {
  referral: ReferralState;
}

export default function ReferralBanner({ referral }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await referral.copyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Don't show if fully unlocked
  if (referral.tier >= 2) return null;

  const nextTier = referral.tiers.find((t) => !t.unlocked);

  return (
    <Card className="border-primary/20 bg-primary/[0.03] shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">친구 초대하고 인사이트 해금</span>
        </div>

        {/* Tier progress */}
        <div className="flex items-center gap-1 mb-3">
          {referral.tiers.map((t, i) => (
            <div key={t.tier} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-full h-1.5 rounded-full transition-colors",
                  t.unlocked ? "bg-primary" : "bg-muted"
                )}
              />
              <div className="flex items-center gap-0.5">
                {t.unlocked ? (
                  <Unlock className="h-2.5 w-2.5 text-primary" />
                ) : (
                  <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-[9px] font-medium",
                    t.unlocked ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Next unlock description */}
        {nextTier && (
          <p className="text-[10px] text-muted-foreground mb-3">
            <span className="font-semibold text-foreground">{nextTier.label}</span>하면{" "}
            <span className="text-primary font-medium">{nextTier.description}</span> 해금!
          </p>
        )}

        {/* Copy referral link */}
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs gap-1.5 border-primary/20 hover:bg-primary/5"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" />
              복사됨!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              초대 링크 복사
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
