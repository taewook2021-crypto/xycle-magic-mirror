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

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card h-screen sticky top-0">
      <div className="px-5 py-6">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Xycle</h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.6} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
