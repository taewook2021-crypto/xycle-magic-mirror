import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trophy, UserCircle, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import bungaejangLogo from "@/assets/bungaejang-logo.svg";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { path: "/ranking", icon: Trophy, label: "랭킹" },
  { path: "/profile", icon: UserCircle, label: "프로필" },
] as const;

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "사용자";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-background border-r border-border/60 h-screen sticky top-0 z-40 transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
        {!collapsed && <img src={bungaejangLogo} alt="분개장" className="h-5" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed && "mx-auto"
          )}
          title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 px-2 pt-4 space-y-0.5">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;

          return (
            <NavLink
              key={path}
              to={path}
              end
              className={cn(
                "flex items-center w-full rounded-lg text-[13px] font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
              )}
              activeClassName="bg-muted text-foreground"
              title={collapsed ? label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2 : 1.6} />
              {!collapsed && label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-border/40 pt-3">
        <div className={cn("flex items-center gap-2.5", collapsed ? "justify-center" : "px-2")}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-8 w-8 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{displayName}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                title="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
