import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-4 p-5 rounded-2xl bg-card transition-all hover:shadow-sm border border-border"
    >
      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
        {isDark ? (
          <Moon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">다크 모드</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          어두운 테마로 전환합니다.
        </p>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}
