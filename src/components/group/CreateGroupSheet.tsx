import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCreateGroup } from "@/hooks/useStudyGroup";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function CreateGroupSheet({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const create = useCreateGroup();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 30) return;
    create.mutate(
      { name: trimmed, is_public: isPublic, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setIsPublic(false);
          onOpenChange(false);
        },
      }
    );
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
          <Input
            placeholder="그룹 소개 한줄 (선택)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
          />
          <div className="flex items-center justify-between">
            <Label htmlFor="public-toggle" className="text-sm text-foreground">
              공개 그룹으로 만들기
            </Label>
            <Switch id="public-toggle" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          {isPublic && (
            <p className="text-[11px] text-muted-foreground -mt-2">
              공개 그룹은 누구나 검색하고 바로 가입할 수 있습니다.
            </p>
          )}
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
