import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Table2, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

const CORRECT_ANSWERS = [2, 3, 3, 1, 2];
const FAKE_SCORES = [5, 4, 4, 3, 3, 3, 2, 2, 1, 1, 0];

type Phase = "input" | "score" | "rank" | "review" | "records" | "weekly";

function getWeekDays(): { label: string; date: Date }[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: ["월", "화", "수", "목", "금", "토", "일"][i],
      date: d,
    };
  });
}

function MiniRecordsTable({ answers, correctAnswers }: { answers: number[]; correctAnswers: number[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 mb-3">
        <Table2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold">회독표</span>
      </div>
      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-[2.5rem_3rem_4.5rem_2.5rem] text-xs font-semibold bg-muted/50 border-b">
          <div className="px-1.5 py-1.5 text-center text-muted-foreground">#</div>
          <div className="px-1.5 py-1.5 text-center text-muted-foreground">정답</div>
          <div className="px-1.5 py-1.5 text-center text-muted-foreground">날짜</div>
          <div className="px-1.5 py-1.5 text-center text-muted-foreground">결과</div>
        </div>
        {correctAnswers.map((correct, i) => {
          const isCorrect = answers[i] === correct;
          const today = new Date();
          const dateStr = `${today.getMonth() + 1}/${today.getDate()}`;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={`grid grid-cols-[2.5rem_3rem_4.5rem_2.5rem] text-sm border-b last:border-b-0 ${
                !isCorrect ? "bg-destructive/5" : ""
              }`}
            >
              <div className="px-1.5 py-1.5 text-center font-mono text-muted-foreground">{i + 1}</div>
              <div className="px-1.5 py-1.5 text-center font-mono">{correct}</div>
              <div className="px-1.5 py-1.5 text-center text-xs text-muted-foreground">{dateStr}</div>
              <div className={`px-1.5 py-1.5 text-center font-bold ${
                isCorrect ? "text-emerald-500" : "text-destructive"
              }`}>
                {isCorrect ? "O" : "X"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MiniWeeklyCalendar({ wrongIndices }: { wrongIndices: number[] }) {
  const weekDays = useMemo(() => getWeekDays(), []);
  const today = new Date();
  const todayStr = today.toDateString();

  const schedule = useMemo(() => {
    const map: Record<string, number[]> = {};
    wrongIndices.forEach((qIdx, i) => {
      const questionNum = qIdx + 1;
      const d1 = new Date(today);
      d1.setDate(today.getDate() + 1 + i);
      const key1 = d1.toDateString();
      if (!map[key1]) map[key1] = [];
      map[key1].push(questionNum);

      const d2 = new Date(today);
      d2.setDate(today.getDate() + 3 + i);
      const key2 = d2.toDateString();
      if (!map[key2]) map[key2] = [];
      map[key2].push(questionNum);
    });
    return map;
  }, [wrongIndices]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold">주간 복습 리스트</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(({ label, date }) => (
          <div
            key={label}
            className={`text-center text-xs font-semibold py-1 ${
              date.toDateString() === todayStr ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </div>
        ))}
        {weekDays.map(({ label, date }) => {
          const key = date.toDateString();
          const isToday = key === todayStr;
          const questions = schedule[key] || [];
          return (
            <motion.div
              key={label + "-cell"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: weekDays.findIndex(w => w.label === label) * 0.04 }}
              className={`border rounded min-h-[3rem] p-1 flex flex-col items-center gap-0.5 ${
                isToday ? "border-primary/40 bg-primary/5" : "bg-muted/20"
              }`}
            >
              <span className={`text-[10px] tabular-nums ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {date.getDate()}
              </span>
              {questions.map((q, qi) => (
                <span
                  key={qi}
                  className="text-[10px] font-bold bg-primary/10 text-primary rounded px-1.5 py-0.5"
                >
                  {q}번
                </span>
              ))}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function GradingDemo() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = input.replace(/[^1-5]/g, "").slice(0, 5);
  const answers = parsed.split("").map(Number);
  const allAnswered = answers.length === 5;
  const score = answers.filter((a, i) => a === CORRECT_ANSWERS[i]).length;
  const wrongIndices = answers.map((a, i) => (a !== CORRECT_ANSWERS[i] ? i : -1)).filter(i => i >= 0);

  const allScores = [...FAKE_SCORES, score].sort((a, b) => b - a);
  const rank = allScores.indexOf(score) + 1;
  const total = allScores.length;
  const percentile = Math.round((rank / total) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase !== "input") return;
    const raw = e.target.value.replace(/[^1-5]/g, "").slice(0, 5);
    setInput(raw);
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setPhase("score");
    setTimeout(() => setPhase("rank"), 1200);
    setTimeout(() => setPhase("review"), 2800);
    setTimeout(() => setPhase("records"), 4300);
    setTimeout(() => setPhase("weekly"), 5800);
  };

  const handleReset = () => {
    setInput("");
    setPhase("input");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const phaseIndex = ["input", "score", "rank", "review", "records", "weekly"].indexOf(phase);

  return (
    <div className="rounded-2xl bg-card p-6 text-left overflow-hidden border border-border/60">
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <Input
              ref={inputRef}
              value={parsed.split("").join("  ")}
              onChange={handleChange}
              placeholder="2  3  3  1  2"
              className="font-mono text-lg tracking-[0.4em] text-center h-14 bg-muted/20 rounded-xl border-border/50 focus:border-primary/40 focus:ring-primary/20 transition-all"
              maxLength={5 + 4 * 2}
            />
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`w-full h-11 rounded-full text-sm font-bold transition-all duration-300 ${
                allAnswered
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              채점하기
            </button>
          </motion.div>
        )}

        {phaseIndex >= 1 && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center py-4"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tabular-nums">{score}</span>
                <span className="text-xl text-muted-foreground font-medium">/ {CORRECT_ANSWERS.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {score === 5 ? "만점이에요! 🎉" : `${CORRECT_ANSWERS.length - score}문제 오답`}
              </p>
            </motion.div>

            <AnimatePresence>
              {phaseIndex >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center gap-2 border rounded-lg px-4 py-3 bg-muted/30"
                >
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    <span className="font-bold">{total}명</span>
                    <span className="text-muted-foreground"> 중 </span>
                    <span className="font-bold text-primary">{rank}등</span>
                    <span className="text-muted-foreground"> · 상위 </span>
                    <span className="font-bold">{percentile}%</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phaseIndex >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 border border-primary/30 rounded-lg px-4 py-3 bg-primary/5"
                >
                  <span className="text-primary text-base">✅</span>
                  <span className="text-sm font-medium">
                    Xycle이 틀린 {CORRECT_ANSWERS.length - score}문제를 복습 리스트에 추가했습니다!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phaseIndex >= 4 && (
                <MiniRecordsTable answers={answers} correctAnswers={CORRECT_ANSWERS} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phaseIndex >= 5 && (
                <MiniWeeklyCalendar wrongIndices={wrongIndices} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase === "weekly" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={handleReset}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    다시 해보기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}