import { useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Trophy, UserCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import bungaejangLogo from "@/assets/bungaejang-logo.svg";

const navItems = [
  { path: "/dashboard", icon: Home, label: "홈" },
  { path: "/review", icon: LayoutGrid, label: "교재 풀이" },
  { path: "/ranking", icon: Trophy, label: "랭킹" },
  { path: "/profile", icon: UserCircle, label: "프로필" },
  { path: "/settings", icon: Settings, label: "설정" },
] as const;

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <img
          src={bungaejangLogo}
          alt="분개장"
          className="h-5 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || location.pathname.startsWith(path + "/");
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.6} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
