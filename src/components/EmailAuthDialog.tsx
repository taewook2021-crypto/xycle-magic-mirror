import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "이메일을 입력해주세요" })
    .email({ message: "이메일 형식이 올바르지 않습니다" })
    .max(255, { message: "이메일이 너무 깁니다" }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 6자 이상이어야 합니다" })
    .max(72, { message: "비밀번호는 72자 이하여야 합니다" }),
});

type Mode = "signin" | "signup";

export default function EmailAuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const reset = () => {
    setErrors({});
    setPassword("");
  };

  const translateError = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
    if (m.includes("already registered") || m.includes("already been registered"))
      return "이미 가입된 이메일입니다. 로그인해주세요.";
    if (m.includes("email not confirmed")) return "이메일 인증이 완료되지 않았습니다.";
    if (m.includes("password")) return "비밀번호가 조건을 만족하지 않습니다.";
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ email: f.email?.[0], password: f.password?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;

        if (!data.session) {
          toast({
            title: "메일함을 확인해주세요",
            description: "가입 확인 메일의 링크를 누르면 로그인이 완료됩니다.",
          });
          onOpenChange(false);
          return;
        }
        toast({ title: "가입 완료", description: "환영합니다!" });
        onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        onOpenChange(false);
      }
    } catch (err: any) {
      toast({
        title: mode === "signup" ? "가입 실패" : "로그인 실패",
        description: translateError(err?.message ?? "알 수 없는 오류가 발생했습니다."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const parsedEmail = z.string().trim().email().safeParse(email);
    if (!parsedEmail.success) {
      setErrors({ email: "비밀번호 재설정을 위해 이메일을 먼저 입력해주세요" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "전송 실패", description: translateError(error.message), variant: "destructive" });
      return;
    }
    toast({ title: "메일을 보냈습니다", description: "메일함에서 비밀번호 재설정 링크를 확인해주세요." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ letterSpacing: "-0.03em" }}>
            {mode === "signin" ? "로그인" : "회원가입"}
          </DialogTitle>
          <DialogDescription style={{ wordBreak: "keep-all" }}>
            {mode === "signin"
              ? "이메일과 비밀번호로 분개장에 로그인하세요."
              : "이메일과 비밀번호만 있으면 바로 시작할 수 있습니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">이메일</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              disabled={loading}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">비밀번호</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={72}
              disabled={loading}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signin" ? "로그인" : "가입하고 시작하기"}
          </Button>
        </form>

        <div className="flex items-center justify-between pt-1 text-sm">
          <button
            type="button"
            className="text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              reset();
            }}
            disabled={loading}
          >
            {mode === "signin" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
          </button>
          {mode === "signin" && (
            <button
              type="button"
              className="text-muted-foreground underline-offset-4 hover:underline"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              비밀번호 찾기
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
