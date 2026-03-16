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

interface NicknameSetupProps {
  userId: string;
  onComplete: (name: string) => void;
}

export default function NicknameSetup({ userId, onComplete }: NicknameSetupProps) {
  const [name, setName] = useState("");
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

    setSaving(true);
    setError("");

    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({ id: userId, display_name: trimmed }, { onConflict: "id" });

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
          <DialogTitle className="text-base">닉네임 설정</DialogTitle>
          <DialogDescription className="text-xs">
            다른 수험생에게 보여질 이름을 설정해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          <Input
            placeholder="예: 회계사지망생"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button onClick={handleSubmit} disabled={saving} className="w-full">
            {saving ? "저장 중..." : "시작하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
