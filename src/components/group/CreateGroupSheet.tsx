import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateGroup } from "@/hooks/useStudyGroup";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function CreateGroupSheet({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const create = useCreateGroup();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 30) return;
    create.mutate(trimmed, {
      onSuccess: () => {
        setName("");
        onOpenChange(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-5 pb-8">
        <SheetHeader>
          <SheetTitle className="text-base font-bold">그룹 만들기</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="그룹 이름 (최대 30자)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
          />
          <Button
            className="w-full rounded-xl"
            onClick={handleSubmit}
            disabled={!name.trim() || create.isPending}
          >
            {create.isPending ? "생성 중…" : "만들기"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
