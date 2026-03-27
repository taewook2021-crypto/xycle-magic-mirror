import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NicknameSetup from "@/components/NicknameSetup";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile, setProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  // Show nickname setup if profile hasn't been configured yet
  const needsSetup = profile && ((!profile.display_name || profile.display_name === "사용자") || !profile.exam_status);

  if (needsSetup) {
    return (
      <NicknameSetup
        userId={user.id}
        onComplete={(name, examStatus) => {
          setProfile({ ...profile!, display_name: name, exam_status: examStatus });
        }}
      />
    );
  }

  return <>{children}</>;
}
