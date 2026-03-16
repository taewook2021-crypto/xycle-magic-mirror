import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Grid3X3, PenLine, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { path: "/review", icon: Grid3X3, label: "회독표" },
  { path: "/grading", icon: PenLine, label: "채점" },
  { path: "/analytics", icon: BarChart3, label: "분석" },
  { path: "/settings", icon: Settings, label: "설정" },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
