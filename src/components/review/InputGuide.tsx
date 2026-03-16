import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, MessageCircle, X } from "lucide-react";
import xycleLogomark from "@/assets/xycle-logomark.svg";

import { useIsMobile } from "@/hooks/use-mobile";

const shortcuts = [
  { keys: ["1"], desc: "O 정답", color: "hsl(var(--success))" },
  { keys: ["2"], desc: "△ 반쪽", color: "hsl(var(--warning))" },
  { keys: ["3"], desc: "X 오답", color: "hsl(var(--destructive))" },
  { keys: ["0", "⌫"], desc: "지우기", color: "hsl(var(--muted-foreground))" },
  { keys: ["↑", "↓", "←", "→"], desc: "셀 이동", color: "hsl(var(--muted-foreground))" },
  { keys: ["S"], desc: "버림 토글", color: "hsl(var(--muted-foreground))" },
  { keys: ["Esc"], desc: "선택 해제", color: "hsl(var(--muted-foreground))" },
];

const mobileGuide = [
  { icon: "👆", title: "셀 탭", desc: "문항을 선택하세요" },
  { icon: "⬇️", title: "하단 바", desc: "O / △ / X 버튼으로 입력" },
  { icon: "⚡", title: "자동 이동", desc: "입력 후 다음 문항으로 이동" },
];

export default function InputGuide() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* KakaoTalk link */}
      <a
        href="https://pf.kakao.com/_uSAyn"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[9.5rem] right-4 z-40 h-12 w-12 rounded-full bg-[#FEE500] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform md:bottom-[5.75rem] group"
        aria-label="카카오톡 문의"
        title="Xycle 카카오톡 채널로 문의하기"
      >
        <MessageCircle className="h-6 w-6 text-[#3C1E1E]" />
      </a>

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full bg-primary shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform md:bottom-6"
      >
        <img src={xycleLogomark} alt="입력 가이드" className="h-6 w-6 brightness-0 invert" />
      </button>

      {/* Guide overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 bottom-24 right-4 w-[min(340px,calc(100vw-2rem))] rounded-xl border border-border bg-card p-5 shadow-xl md:bottom-10"
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-accent transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                  <Keyboard className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">입력 가이드</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isMobile ? "탭으로 빠르게 입력하세요" : "키보드로 빠르게 입력하세요"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border mb-3" />

              {isMobile ? (
                <div className="grid grid-cols-3 gap-3">
                  {mobileGuide.map((step, i) => (
                    <div key={i} className="text-center space-y-1.5">
                      <span className="text-lg">{step.icon}</span>
                      <p className="text-[11px] font-semibold text-foreground">{step.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{step.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                  {shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1 shrink-0">
                        {s.keys.map((k) => (
                          <kbd
                            key={k}
                            className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-[4px] border border-border bg-muted text-[10px] font-mono font-medium text-foreground"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                      <span
                        className="text-[11px] text-muted-foreground"
                        style={{ color: s.color !== "hsl(var(--muted-foreground))" ? s.color : undefined }}
                      >
                        {s.desc}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
