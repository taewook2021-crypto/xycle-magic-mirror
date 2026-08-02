import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import bungaejangLogo from "@/assets/bungaejang-logo.svg";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().min(6, "비밀번호는 6자 이상이어야 합니다").max(72).safeParse(password);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      toast({ title: "변경 실패", description: updateError.message, variant: "destructive" });
      return;
    }
    toast({ title: "비밀번호가 변경되었습니다" });
    navigate("/dashboard", { replace: true });
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F0C4EC 100%)" }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg">
        <img src={bungaejangLogo} alt="분개장" className="h-5 mb-6" />
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ letterSpacing: "-0.03em" }}>
          비밀번호 재설정
        </h1>
        <p className="text-sm text-muted-foreground mb-6" style={{ wordBreak: "keep-all" }}>
          {ready
            ? "새로 사용할 비밀번호를 입력해주세요."
            : "재설정 링크를 확인하는 중입니다. 메일의 링크로 접속했는지 확인해주세요."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={72}
              disabled={!ready || loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">비밀번호 확인</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              maxLength={72}
              disabled={!ready || loading}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={!ready || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            비밀번호 변경
          </Button>
        </form>
      </div>
    </main>
  );
}
