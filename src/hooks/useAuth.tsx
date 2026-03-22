import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type Profile = {
  display_name: string;
  is_public: boolean;
  exam_status: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: "instructor" | "student" | null;
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  profile: null,
  setProfile: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"instructor" | "student" | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRole = async (userId: string) => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Role fetch error:", error);
        return null;
      }

      return (data?.role as "instructor" | "student") ?? null;
    };

    const fetchProfile = async (userId: string, userName?: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, is_public, exam_status")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        return null;
      }

      // Auto-create profile if it doesn't exist
      if (!data) {
        const defaultName = userName || "사용자";
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({ id: userId, display_name: defaultName, is_public: true })
          .select("display_name, is_public, exam_status")
          .single();
        if (insertError) {
          console.error("Profile create error:", insertError);
          return null;
        }
        return newProfile as Profile;
      }

      return data as Profile | null;
    };

    const syncSession = async (nextSession: Session | null) => {
      if (!isMounted) return;

      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const userName = nextUser.user_metadata?.full_name || nextUser.user_metadata?.name || nextUser.email?.split("@")[0];
      const [nextRole, nextProfile] = await Promise.all([
        fetchRole(nextUser.id),
        fetchProfile(nextUser.id, userName),
      ]);

      if (!isMounted) return;

      setRole(nextRole);
      setProfile(nextProfile);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    void supabase.auth.getSession()
      .then(({ data: { session: currentSession } }) => {
        void syncSession(currentSession);
      })
      .catch((error) => {
        console.error("getSession error:", error);
        if (isMounted) setLoading(false);
      });

    const loadingTimeout = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    return () => {
      isMounted = false;
      window.clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = (p: Profile) => setProfile(p);

  return (
    <AuthContext.Provider value={{ user, session, loading, role, profile, setProfile: updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
