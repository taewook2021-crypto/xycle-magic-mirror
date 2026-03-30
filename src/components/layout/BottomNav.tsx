import { useLocation } from "react-router-dom";
import { LayoutDashboard, Trophy, UserCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { path: "/ranking", icon: Trophy, label: "랭킹" },
  { path: "/groups", icon: Users, label: "스터디" },
  { path: "/profile", icon: UserCircle, label: "프로필" },
] as const;

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;

          return (
            <NavLink
              key={path}
              to={path}
              end
              className="flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors text-muted-foreground"
              activeClassName="text-primary"
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
