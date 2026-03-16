import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw, BookOpen, ChevronRight, Flame, TrendingUp } from "lucide-react";

/* ─── 1. Ranking (동차생 비교 — 스트라바 스타일) ─── */
function MockRanking() {
  const weekData = [
    { day: "월", me: 28, avg: 22 },
    { day: "화", me: 35, avg: 20 },
    { day: "수", me: 18, avg: 24 },
    { day: "목", me: 32, avg: 19 },
    { day: "금", me: 40, avg: 25 },
    { day: "토", me: 22, avg: 18 },
    { day: "일", me: 32, avg: 18 },
  ];
  const maxVal = 45;

  const feed = [
    { name: "김O현", count: 45, emoji: "🏃" },
    { name: "박O수", count: 38, emoji: "📖" },
    { name: "나", count: 32, me: true, emoji: "🔥" },
    { name: "이O준", count: 28, emoji: "✏️" },
    { name: "최O영", count: 21, emoji: "📚" },
  ];

  return (
    <div className="p-3 space-y-2.5">
      {/* 오늘의 활동 */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>오늘의 풀이</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(11 82% 54% / 0.1)", color: "hsl(11 82% 54%)" }}>
            연속 12일째 🔥
          </span>
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>32</span>
            <span className="text-sm font-medium" style={{ color: "hsl(0 0% 45%)" }}>문제</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold" style={{ color: "hsl(142 72% 40%)" }}>
              ▲ 평균보다 14문제 더
            </span>
          </div>
        </div>
      </div>

      {/* 주간 풀이량 차트 (나 vs 평균) */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>주간 풀이량</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: "hsl(0 0% 14%)" }} />
              <span className="text-[9px]" style={{ color: "hsl(0 0% 45%)" }}>나</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: "hsl(0 0% 80%)" }} />
              <span className="text-[9px]" style={{ color: "hsl(0 0% 45%)" }}>평균</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1.5" style={{ height: "60px" }}>
          {weekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-px" style={{ height: "48px" }}>
                <div
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${(d.me / maxVal) * 100}%`,
                    background: "hsl(0 0% 14%)",
                  }}
                />
                <div
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${(d.avg / maxVal) * 100}%`,
                    background: "hsl(0 0% 80%)",
                  }}
                />
              </div>
              <span className="text-[8px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 동차생 피드 */}
      <div className="rounded-lg p-3 space-y-1.5" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>오늘의 동차생 풀이량</span>
        <div className="space-y-1">
          {feed.map((f, i) => (
            <div
              key={f.name}
              className="flex items-center justify-between rounded-md px-2.5 py-2"
              style={{
                background: f.me ? "hsl(11 82% 54% / 0.06)" : "hsl(0 0% 100% / 0.6)",
                border: f.me ? "1px solid hsl(11 82% 54% / 0.2)" : "1px solid hsl(0 0% 90%)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{f.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: f.me ? "hsl(11 82% 54%)" : "hsl(0 0% 14%)" }}>
                  {f.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${(f.count / 45) * 60}px`, background: f.me ? "hsl(11 82% 54%)" : "hsl(0 0% 75%)" }} />
                <span className="text-[11px] font-bold tabular-nums" style={{ color: f.me ? "hsl(11 82% 54%)" : "hsl(0 0% 14%)" }}>
                  {f.count}문제
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Review ─── */
function MockReview() {
  const books = [
    { name: "세법학개론 실전모의고사", today: 8, total: 34 },
  ];

  return (
    <div className="p-3 space-y-3">
      <div>
        <h3 className="text-sm font-bold" style={{ color: "hsl(0 0% 14%)" }}>오늘의 복습</h3>
        <p className="text-[11px]" style={{ color: "hsl(0 0% 45%)" }}>
          오늘 복습 <span className="font-bold" style={{ color: "hsl(0 0% 14%)" }}>8문항</span>
        </p>
      </div>
      <div className="rounded-md overflow-hidden" style={{ border: "1px solid hsl(0 0% 90%)" }}>
        {books.map((book, i) => (
          <div
            key={book.name}
            className="flex items-center justify-between px-3 py-2.5"
            style={{ borderTop: i > 0 ? "1px solid hsl(0 0% 90%)" : undefined }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(0 0% 45%)" }} />
              <span className="text-xs font-medium truncate" style={{ color: "hsl(0 0% 14%)" }}>{book.name}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-xl" style={{ background: "hsl(0 0% 14%)", color: "hsl(0 0% 100%)" }}>
                {book.today}문항
              </span>
              <ChevronRight className="h-3 w-3" style={{ color: "hsl(0 0% 45%)" }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-md p-3 space-y-2" style={{ border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>
          틀린 문제 번호 입력
        </p>
        <div className="rounded-md px-3 py-1.5 text-xs font-mono" style={{ border: "1px solid hsl(0 0% 90%)", color: "hsl(0 0% 45%)" }}>
          5, 15, 25
        </div>
        <div className="flex gap-1 flex-wrap">
          {[5, 15, 25].map((n) => (
            <span key={n} className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "hsl(0 72% 51% / 0.1)", color: "hsl(0 72% 51%)" }}>
              {n}번
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Growth ─── */
function MockGrowth() {
  const stats = [
    { label: "오늘의 복습", value: "8", suffix: "문제", icon: RefreshCw },
    { label: "평균 순위", value: "상위 23", suffix: "%", icon: TrendingUp },
    { label: "최고 순위", value: "3", suffix: "위", icon: Trophy },
    { label: "연속 학습", value: "12", suffix: "일", icon: Flame },
  ];

  const points = [52, 60, 58, 72, 68, 80, 85, 88];
  const w = 240;
  const h = 80;
  const max = 100;
  const px = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - (p / max) * h,
  }));
  const pathD = px.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-px rounded overflow-hidden" style={{ background: "hsl(0 0% 90%)", border: "1px solid hsl(0 0% 90%)" }}>
        {stats.map((s) => (
          <div key={s.label} className="p-2.5" style={{ background: "hsl(0 0% 100%)" }}>
            <div className="flex items-center gap-1 mb-0.5">
              <s.icon className="h-2.5 w-2.5" style={{ color: "hsl(0 0% 45%)" }} />
              <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>{s.label}</span>
            </div>
            <div className="text-base font-bold" style={{ color: "hsl(0 0% 14%)" }}>
              {s.value}
              <span className="text-[10px] font-normal ml-0.5" style={{ color: "hsl(0 0% 45%)" }}>{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-md p-3" style={{ border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[10px] font-bold mb-2" style={{ color: "hsl(0 0% 45%)" }}>정답률 추이</p>
        <svg viewBox={`-5 -5 ${w + 20} ${h + 20}`} className="w-full">
          {[0, 25, 50, 75, 100].map((v) => (
            <line key={v} x1={0} y1={h - (v / max) * h} x2={w} y2={h - (v / max) * h} stroke="hsl(0 0% 90%)" strokeWidth="0.5" />
          ))}
          <path d={pathD} fill="none" stroke="hsl(0 0% 14%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {px.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(0 0% 14%)" />
          ))}
          <text x={px[px.length - 1].x + 6} y={px[px.length - 1].y + 3} style={{ fontSize: "8px", fill: "hsl(142 72% 40%)", fontWeight: 700 }}>
            88%
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ─── 4. Records Table ─── */
function MockRecords() {
  const questions = [
    { num: 1, subject: "국기", rate: "82%", review: null, rounds: [true, true] },
    { num: 5, subject: "국징", rate: "67%", review: "오늘", rounds: [false, true] },
    { num: 11, subject: "소득", rate: "91%", review: null, rounds: [true, true] },
    { num: 15, subject: "소득", rate: "45%", review: "2일 후", rounds: [false, false] },
    { num: 21, subject: "법인", rate: "73%", review: null, rounds: [true, true] },
    { num: 25, subject: "법인", rate: "38%", review: "내일", rounds: [false, true] },
    { num: 31, subject: "부가", rate: "88%", review: "습득", rounds: [true, true] },
    { num: 39, subject: "국조", rate: "55%", review: null, rounds: [true, false] },
  ];

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold" style={{ color: "hsl(0 0% 14%)" }}>회독표</h3>
          <p className="text-[10px]" style={{ color: "hsl(0 0% 45%)" }}>
            <span className="font-medium" style={{ color: "hsl(0 0% 14%)" }}>세법학개론 실전모의고사</span> · 1회
          </p>
        </div>
      </div>
      <div className="flex gap-0" style={{ borderBottom: "1px solid hsl(0 0% 90%)" }}>
        {["1회", "2회", "3회", "4회", "5회"].map((t, i) => (
          <button
            key={t}
            className="px-2.5 py-1.5 text-[10px] font-medium"
            style={{
              borderBottom: i === 0 ? "2px solid hsl(0 0% 14%)" : "2px solid transparent",
              color: i === 0 ? "hsl(0 0% 14%)" : "hsl(0 0% 45%)",
              marginBottom: "-1px",
            }}
          >
            {t} <span className="text-[9px]" style={{ color: "hsl(0 0% 45%)" }}>({i === 0 ? 2 : 1}독)</span>
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-b" style={{ border: "1px solid hsl(0 0% 90%)", borderTop: 0 }}>
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ background: "hsl(0 0% 96% / 0.5)", borderBottom: "1px solid hsl(0 0% 90%)" }}>
              <th className="px-2 py-1.5 text-left font-semibold" style={{ color: "hsl(0 0% 45%)", width: "1.5rem" }}>#</th>
              <th className="px-1.5 py-1.5 text-left font-semibold" style={{ color: "hsl(0 0% 45%)" }}>과목</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>정답률</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>복습</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>1독</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>2독</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.num} style={{ borderBottom: "1px solid hsl(0 0% 95%)" }}>
                <td className="px-2 py-1 font-medium tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>{q.num}</td>
                <td className="px-1.5 py-1" style={{ color: "hsl(0 0% 45%)" }}>{q.subject}</td>
                <td className="px-1.5 py-1 text-center tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>{q.rate}</td>
                <td className="px-1.5 py-1 text-center">
                  {q.review === "습득" ? (
                    <span className="font-semibold" style={{ color: "hsl(142 72% 40%)" }}>습득</span>
                  ) : q.review === "오늘" || q.review === "내일" ? (
                    <span className="font-semibold" style={{ color: "hsl(36 100% 50%)" }}>{q.review}</span>
                  ) : q.review ? (
                    <span style={{ color: "hsl(0 0% 45%)" }}>{q.review}</span>
                  ) : (
                    <span style={{ color: "hsl(0 0% 45% / 0.3)" }}>–</span>
                  )}
                </td>
                {q.rounds.map((ok, i) => (
                  <td key={i} className="px-1.5 py-1 text-center">
                    {ok ? (
                      <span className="font-bold text-[11px]" style={{ color: "hsl(142 72% 40%)" }}>○</span>
                    ) : (
                      <span className="font-bold text-[11px]" style={{ color: "hsl(0 72% 51%)" }}>✕</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── 5. Weekly Calendar ─── */
function MockWeekly() {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const schedule: Record<number, { nums: number[]; book: string }[]> = {
    [todayIdx]: [
      { nums: [5, 15, 25], book: "세법학개론" },
    ],
    [(todayIdx + 1) % 7]: [{ nums: [11, 31], book: "세법학개론" }],
    [(todayIdx + 2) % 7]: [{ nums: [21], book: "세법학개론" }],
    [(todayIdx + 3) % 7]: [{ nums: [5, 39], book: "세법학개론" }],
    [(todayIdx + 5) % 7]: [{ nums: [15], book: "세법학개론" }],
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: "hsl(0 0% 14%)" }}>주간 복습</h3>
        <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>3월 1주</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const isToday = i === todayIdx;
          const items = schedule[i] || [];
          const totalCount = items.reduce((s, g) => s + g.nums.length, 0);
          return (
            <div key={d} className="text-center">
              <div
                className="text-[9px] font-bold mb-1"
                style={{ color: isToday ? "hsl(0 0% 14%)" : "hsl(0 0% 45%)" }}
              >
                {d}
              </div>
              <div
                className="min-h-[56px] rounded-lg p-1 flex flex-col items-center gap-0.5"
                style={{
                  background: isToday ? "hsl(0 0% 14% / 0.05)" : "hsl(0 0% 96%)",
                  border: isToday ? "1px solid hsl(0 0% 14% / 0.2)" : "1px solid transparent",
                }}
              >
                {totalCount > 0 && (
                  <span
                    className="text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center mb-0.5"
                    style={{
                      background: isToday ? "hsl(0 0% 14%)" : "hsl(0 0% 45%)",
                      color: "hsl(0 0% 100%)",
                    }}
                  >
                    {totalCount}
                  </span>
                )}
                {items.map((group) =>
                  group.nums.slice(0, 2).map((n) => (
                    <span
                      key={`${group.book}-${n}`}
                      className="text-[8px] rounded px-1 py-0.5 font-medium truncate w-full text-center"
                      style={{
                        background: "hsl(0 0% 14% / 0.08)",
                        color: "hsl(0 0% 14%)",
                      }}
                    >
                      {n}번
                    </span>
                  ))
                )}
                {totalCount > 2 && (
                  <span className="text-[7px]" style={{ color: "hsl(0 0% 45%)" }}>+{totalCount - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-md p-2.5 space-y-1.5" style={{ border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[10px] font-bold" style={{ color: "hsl(0 0% 14%)" }}>오늘 복습</p>
        {(schedule[todayIdx] || []).map((group) => (
          <div key={group.book} className="flex items-center gap-2">
            <span className="text-[9px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>{group.book}</span>
            <div className="flex gap-1">
              {group.nums.map((n) => (
                <span
                  key={n}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "hsl(0 0% 14%)", color: "hsl(0 0% 100%)" }}
                >
                  {n}번
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Mockup Component ─── */
const SCREENS = [MockRanking, MockReview, MockGrowth, MockRecords, MockWeekly];

export default function AppMockup({ activeFeature }: { activeFeature: number }) {
  const Screen = SCREENS[activeFeature] || SCREENS[0];

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div
        className="rounded-2xl p-[1px]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.4), 0 0 40px -8px rgba(234,80,39,0.08)",
        }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "hsl(0 0% 100%)" }}
        >
          <div className="flex items-center justify-between px-4 py-2" style={{ background: "hsl(0 0% 97%)", borderBottom: "1px solid hsl(0 0% 92%)" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0 72% 51% / 0.6)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "hsl(45 100% 51% / 0.6)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "hsl(142 72% 40% / 0.6)" }} />
            </div>
            <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", color: "hsl(0 0% 55%)", textTransform: "uppercase" }}>
              xycle preview
            </span>
            <div style={{ width: "36px" }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}