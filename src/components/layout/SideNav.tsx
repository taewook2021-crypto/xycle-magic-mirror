import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trophy, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
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

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "사용자";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-[220px] bg-white border-r border-border/60 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/40">
        <img src={bungaejangLogo} alt="분개장" className="h-5" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2 : 1.6} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User profile & logout */}
      <div className="px-3 pb-4 border-t border-border/40 pt-3">
        <div className="flex items-center gap-2.5 px-2">
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
        </div>
      </div>
    </aside>
  );
}
