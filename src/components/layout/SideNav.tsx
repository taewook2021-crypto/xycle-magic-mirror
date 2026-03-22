import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trophy, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { path: "/ranking", icon: Trophy, label: "랭킹" },
  { path: "/profile", icon: UserCircle, label: "프로필" },
] as const;

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card h-screen sticky top-0">
      <div className="px-5 py-6">
        <h1 className="text-lg font-bold text-foreground tracking-tight">분개장</h1>
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
