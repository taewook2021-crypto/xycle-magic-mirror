import BottomNav from "./BottomNav";
import SideNav from "./SideNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <SideNav />
      <div className="flex-1 pb-16 md:pb-0">
        <main className="max-w-4xl mx-auto">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
