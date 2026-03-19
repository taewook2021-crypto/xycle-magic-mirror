import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COLORS = [
  { label: "주황", value: "11 82% 54%" },
  { label: "파랑", value: "217 91% 60%" },
  { label: "초록", value: "142 72% 40%" },
  { label: "보라", value: "270 67% 55%" },
  { label: "분홍", value: "340 82% 60%" },
  { label: "노랑", value: "45 93% 55%" },
  { label: "하늘", value: "195 85% 55%" },
  { label: "빨강", value: "0 72% 51%" },
];

interface AddSubjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, color: string) => void;
}

export default function AddSubjectSheet({ open, onOpenChange, onAdd }: AddSubjectSheetProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0].value);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
    setColor(COLORS[0].value);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>과목 추가</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <Input
            placeholder="과목명 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <div>
            <p className="text-xs text-muted-foreground mb-2">색상 선택</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    color === c.value ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: `hsl(${c.value})` }}
                />
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            추가
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">취소</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
