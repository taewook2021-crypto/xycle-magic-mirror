import { motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import xycleLogomark from "@/assets/xycle-logomark.svg";
import { useIsMobile } from "@/hooks/use-mobile";

const shortcuts = [
  { keys: ["1"], desc: "O 정답", color: "hsl(var(--success))" },
  { keys: ["2"], desc: "△ 반쪽", color: "hsl(var(--warning))" },
  { keys: ["3"], desc: "X 오답", color: "hsl(var(--destructive))" },
  { keys: ["0", "⌫"], desc: "지우기", color: "hsl(var(--muted-foreground))" },
  { keys: ["↑", "↓", "←", "→"], desc: "셀 이동", color: "hsl(var(--muted-foreground))" },
  { keys: ["Esc"], desc: "선택 해제", color: "hsl(var(--muted-foreground))" },
];

const mobileGuide = [
  { icon: "👆", title: "셀 탭", desc: "문항을 선택하세요" },
  { icon: "⬇️", title: "하단 바", desc: "O / △ / X 버튼으로 입력" },
  { icon: "⚡", title: "자동 이동", desc: "입력 후 다음 문항으로 이동" },
];

export default function InputGuide() {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      {/* Background logomark */}
      <img
        src={xycleLogomark}
        alt=""
        className="absolute -right-6 -bottom-6 w-28 h-28 opacity-[0.04] pointer-events-none select-none"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
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

      <div className="h-px bg-border mb-4" />

      {isMobile ? (
        /* Mobile: step-by-step guide */
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
        /* Desktop: keyboard shortcuts grid */
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-1 shrink-0">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md border border-border bg-muted text-[11px] font-mono font-medium text-foreground shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <span className="text-xs text-muted-foreground" style={{ color: s.color !== "hsl(var(--muted-foreground))" ? s.color : undefined }}>
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Notion-style callout tip */}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2.5">
        <span className="text-sm mt-px">💡</span>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {isMobile
            ? "셀을 탭하면 하단에 입력 바가 나타납니다. 입력 후 자동으로 다음 문항으로 넘어갑니다."
            : "셀을 클릭한 뒤 숫자키로 빠르게 입력하세요. 입력 후 자동으로 다음 문항으로 넘어갑니다."}
        </p>
      </div>
    </motion.div>
  );
}
