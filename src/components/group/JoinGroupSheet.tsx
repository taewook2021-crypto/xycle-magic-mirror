import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJoinGroup } from "@/hooks/useStudyGroup";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function JoinGroupSheet({ open, onOpenChange }: Props) {
  const [code, setCode] = useState("");
  const join = useJoinGroup();

  const handleSubmit = () => {
    const trimmed = code.trim();
    if (trimmed.length !== 6) return;
    join.mutate(trimmed, {
      onSuccess: () => {
        setCode("");
        onOpenChange(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-5 pb-24 md:pb-8">
        <SheetHeader>
          <SheetTitle className="text-base font-bold">코드로 가입</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="6자리 초대 코드"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center tracking-[0.3em] font-mono text-lg"
          />
          <Button
            className="w-full rounded-xl"
            onClick={handleSubmit}
            disabled={code.trim().length !== 6 || join.isPending}
          >
            {join.isPending ? "가입 중…" : "가입하기"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
