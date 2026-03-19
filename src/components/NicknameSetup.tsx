import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const EXAM_STATUSES = [
  { value: "초시생", label: "초시생", desc: "첫 시험 준비" },
  { value: "동차생", label: "동차생", desc: "1차·2차 동시 준비" },
  { value: "유예생", label: "유예생", desc: "1차 합격, 2차 준비" },
  { value: "N시생", label: "N시생", desc: "재도전" },
];

interface NicknameSetupProps {
  userId: string;
  onComplete: (name: string) => void;
}

export default function NicknameSetup({ userId, onComplete }: NicknameSetupProps) {
  const [name, setName] = useState("");
  const [examStatus, setExamStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (trimmed.length > 20) {
      setError("20자 이하로 입력해주세요.");
      return;
    }
    if (!examStatus) {
      setError("수험 유형을 선택해주세요.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: dbError } = await supabase
      .from("profiles")
      .upsert(
        { id: userId, display_name: trimmed, exam_status: examStatus },
        { onConflict: "id" }
      );

    if (dbError) {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
      setSaving(false);
      return;
    }

    onComplete(trimmed);
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-base">프로필 설정</DialogTitle>
          <DialogDescription className="text-xs">
            닉네임과 수험 유형을 설정해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">닉네임</label>
            <Input
              placeholder="예: 회계사지망생"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">수험 유형</label>
            <div className="grid grid-cols-2 gap-2">
              {EXAM_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setExamStatus(s.value)}
                  className={cn(
                    "flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-all",
                    examStatus === s.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-accent/50"
                  )}
                >
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-[11px] text-muted-foreground">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button onClick={handleSubmit} disabled={saving} className="w-full">
            {saving ? "저장 중..." : "시작하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
