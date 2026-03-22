import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Flame, TrendingUp, Filter, CheckCircle2, BarChart3, PenLine } from "lucide-react";

/* ─── 0. 교재 횡단 취약 단원 ─── */
function MockCrossBook() {
  const topics = [
    {
      topic: "유형자산 감가상각",
      books: [
        { name: "김기동 연습서", wrong: [12, 34, 51], total: 5 },
        { name: "2026 파이널", wrong: [8, 22], total: 3 },
      ],
      totalWrong: 5,
      rate: 38,
    },
    {
      topic: "수익인식",
      books: [
        { name: "김기동 연습서", wrong: [7, 28], total: 3 },
        { name: "2026 파이널", wrong: [15], total: 2 },
      ],
      totalWrong: 3,
      rate: 52,
    },
    {
      topic: "재고자산",
      books: [
        { name: "김기동 연습서", wrong: [19], total: 2 },
        { name: "2026 파이널", wrong: [3, 11], total: 3 },
      ],
      totalWrong: 3,
      rate: 61,
    },
  ];

  return (
    <div className="p-3 space-y-2.5">
      {/* 헤더 */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>교재 횡단 · 취약 단원</span>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(0 0% 14%)", color: "hsl(0 0% 100%)" }}>
            김기동 연습서
          </span>
          <span className="text-[10px]" style={{ color: "hsl(0 0% 45%)" }}>+</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(0 0% 14%)", color: "hsl(0 0% 100%)" }}>
            2026 파이널
          </span>
        </div>
        <p className="text-[10px] mt-2" style={{ color: "hsl(11 82% 54%)" }}>
          2개 교재에서 같은 단원 오답을 자동 합산합니다
        </p>
      </div>

      {/* 취약 단원 리스트 */}
      <div className="space-y-1.5">
        {topics.map((t, i) => (
          <div
            key={t.topic}
            className="rounded-lg p-3"
            style={{
              background: i === 0 ? "hsl(0 72% 51% / 0.04)" : "hsl(0 0% 96%)",
              border: i === 0 ? "1px solid hsl(0 72% 51% / 0.15)" : "1px solid hsl(0 0% 90%)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: i === 0 ? "hsl(0 72% 51% / 0.12)" : "hsl(0 0% 88%)", color: i === 0 ? "hsl(0 72% 51%)" : "hsl(0 0% 45%)" }}>
                  {i === 0 ? "🔥 최약" : `#${i + 1}`}
                </span>
                <span className="text-xs font-bold" style={{ color: "hsl(0 0% 14%)" }}>{t.topic}</span>
              </div>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: i === 0 ? "hsl(0 72% 51%)" : "hsl(0 0% 14%)" }}>
                {t.rate}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "hsl(0 0% 88%)" }}>
              <div className="h-full rounded-full" style={{ width: `${t.rate}%`, background: i === 0 ? "hsl(0 72% 51%)" : "hsl(0 0% 14%)" }} />
            </div>
            <div className="space-y-1">
              {t.books.map((b) => (
                <div key={b.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-2.5 w-2.5" style={{ color: "hsl(0 0% 55%)" }} />
                    <span className="text-[9px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>{b.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {b.wrong.map((n) => (
                      <span key={n} className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: "hsl(0 72% 51% / 0.08)", color: "hsl(0 72% 51%)" }}>
                        {n}번
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 1. 동차생 풀이량 비교 (스트라바) ─── */
function MockPeerCompare() {
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
              ▲ 동차생 평균보다 14문제 더
            </span>
          </div>
        </div>
      </div>

      {/* 주간 풀이량 차트 */}
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
              <span className="text-[9px]" style={{ color: "hsl(0 0% 45%)" }}>동차생 평균</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1.5" style={{ height: "60px" }}>
          {weekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-px" style={{ height: "48px" }}>
                <div className="flex-1 rounded-t-sm" style={{ height: `${(d.me / maxVal) * 100}%`, background: "hsl(0 0% 14%)" }} />
                <div className="flex-1 rounded-t-sm" style={{ height: `${(d.avg / maxVal) * 100}%`, background: "hsl(0 0% 80%)" }} />
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
          {feed.map((f) => (
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

/* ─── 2. N번 틀린 것만 필터 ─── */
function MockWrongFilter() {
  const filters = [
    { label: "전체", active: false },
    { label: "1번 이상", active: false },
    { label: "2번 이상", active: true },
    { label: "3번 이상", active: false },
  ];

  const filtered = [
    { num: 5, subject: "국징", wrongCount: 3, rounds: [false, false, false], book: "세법학개론 모의고사" },
    { num: 15, subject: "소득", wrongCount: 2, rounds: [false, true, false], book: "세법학개론 모의고사" },
    { num: 25, subject: "법인", wrongCount: 2, rounds: [true, false, false], book: "세법학개론 모의고사" },
    { num: 8, subject: "소득", wrongCount: 3, rounds: [false, false, false], book: "2026 파이널" },
    { num: 22, subject: "부가", wrongCount: 2, rounds: [false, true, false], book: "2026 파이널" },
  ];

  return (
    <div className="p-3 space-y-2.5">
      {/* 필터 헤더 */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Filter className="h-3.5 w-3.5" style={{ color: "hsl(11 82% 54%)" }} />
          <span className="text-[10px] font-bold" style={{ color: "hsl(0 0% 14%)" }}>틀린 횟수로 필터</span>
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.label}
              className="text-[9px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: f.active ? "hsl(0 0% 14%)" : "hsl(0 0% 100%)",
                color: f.active ? "hsl(0 0% 100%)" : "hsl(0 0% 45%)",
                border: f.active ? "1px solid hsl(0 0% 14%)" : "1px solid hsl(0 0% 85%)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-2" style={{ color: "hsl(11 82% 54%)" }}>
          2번 이상 틀린 문제 <span className="font-bold">5개</span>만 표시 중
        </p>
      </div>

      {/* 필터된 결과 */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid hsl(0 0% 90%)" }}>
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ background: "hsl(0 0% 96%)", borderBottom: "1px solid hsl(0 0% 90%)" }}>
              <th className="px-2 py-1.5 text-left font-semibold" style={{ color: "hsl(0 0% 45%)" }}>#</th>
              <th className="px-1.5 py-1.5 text-left font-semibold" style={{ color: "hsl(0 0% 45%)" }}>과목</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 72% 51%)" }}>틀린 수</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>1독</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>2독</th>
              <th className="px-1.5 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>3독</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => (
              <tr key={`${q.book}-${q.num}`} style={{ borderBottom: "1px solid hsl(0 0% 95%)", background: i === 0 ? "hsl(0 72% 51% / 0.03)" : undefined }}>
                <td className="px-2 py-1.5 font-medium tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>{q.num}</td>
                <td className="px-1.5 py-1.5" style={{ color: "hsl(0 0% 45%)" }}>
                  <div>{q.subject}</div>
                  <div className="text-[8px]" style={{ color: "hsl(0 0% 65%)" }}>{q.book}</div>
                </td>
                <td className="px-1.5 py-1.5 text-center">
                  <span className="font-bold px-1.5 py-0.5 rounded" style={{ background: q.wrongCount >= 3 ? "hsl(0 72% 51% / 0.12)" : "hsl(36 100% 50% / 0.12)", color: q.wrongCount >= 3 ? "hsl(0 72% 51%)" : "hsl(36 100% 50%)" }}>
                    {q.wrongCount}회
                  </span>
                </td>
                {q.rounds.map((ok, ri) => (
                  <td key={ri} className="px-1.5 py-1.5 text-center">
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

      {/* 종이 비교 메시지 */}
      <div className="rounded-lg p-2.5 text-center" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[9px]" style={{ color: "hsl(0 0% 55%)" }}>
          종이 회독표에선 전체를 훑어야 합니다.<br />
          <span className="font-bold" style={{ color: "hsl(0 0% 14%)" }}>분개장은 터치 한 번.</span>
        </p>
      </div>
    </div>
  );
}

/* ─── 3. 풀이 기록 추적 ─── */
function MockGrowth() {
  const stats = [
    { label: "오늘 풀이", value: "32", suffix: "문제", icon: PenLine },
    { label: "이번 주", value: "207", suffix: "문제", icon: BarChart3 },
    { label: "연속 학습", value: "12", suffix: "일", icon: Flame },
    { label: "정답률 추이", value: "↑ 14", suffix: "%p", icon: TrendingUp },
  ];

  const dailyData = [
    { day: "월", count: 28 },
    { day: "화", count: 35 },
    { day: "수", count: 18 },
    { day: "목", count: 32 },
    { day: "금", count: 40 },
    { day: "토", count: 22 },
    { day: "일", count: 32 },
  ];
  const maxCount = 45;

  const points = [52, 60, 58, 72, 68, 80, 85, 88];
  const w = 240;
  const h = 65;
  const max = 100;
  const px = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - (p / max) * h,
  }));
  const pathD = px.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className="p-3 space-y-2.5">
      <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden" style={{ background: "hsl(0 0% 90%)", border: "1px solid hsl(0 0% 90%)" }}>
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

      {/* 일별 풀이량 */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[10px] font-medium mb-2" style={{ color: "hsl(0 0% 45%)" }}>일별 풀이량</p>
        <div className="flex items-end gap-2" style={{ height: "50px" }}>
          {dailyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-[8px] font-bold tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>{d.count}</span>
              <div className="w-full rounded-t-sm" style={{ height: `${(d.count / maxCount) * 36}px`, background: "hsl(0 0% 14%)" }} />
              <span className="text-[8px]" style={{ color: "hsl(0 0% 45%)" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 정답률 추이 */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[10px] font-medium mb-2" style={{ color: "hsl(0 0% 45%)" }}>정답률 추이 (최근 8회)</p>
        <svg viewBox={`-5 -5 ${w + 20} ${h + 15}`} className="w-full">
          {[0, 50, 100].map((v) => (
            <line key={v} x1={0} y1={h - (v / max) * h} x2={w} y2={h - (v / max) * h} stroke="hsl(0 0% 88%)" strokeWidth="0.5" />
          ))}
          <path d={pathD} fill="none" stroke="hsl(0 0% 14%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {px.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill="hsl(0 0% 14%)" />
          ))}
          <text x={px[px.length - 1].x + 5} y={px[px.length - 1].y + 3} style={{ fontSize: "7px", fill: "hsl(142 72% 40%)", fontWeight: 700 }}>88%</text>
          <text x={px[0].x - 2} y={px[0].y - 4} style={{ fontSize: "7px", fill: "hsl(0 0% 55%)", fontWeight: 500 }}>52%</text>
        </svg>
      </div>
    </div>
  );
}

/* ─── 4. 간편 채점 ─── */
function MockGrading() {
  const answers = [
    { num: 1, my: 3, correct: 3, ok: true },
    { num: 2, my: 1, correct: 1, ok: true },
    { num: 3, my: 4, correct: 2, ok: false },
    { num: 4, my: 2, correct: 2, ok: true },
    { num: 5, my: 1, correct: 3, ok: false },
  ];
  const score = answers.filter((a) => a.ok).length;

  return (
    <div className="p-3 space-y-2.5">
      {/* 채점 결과 */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <span className="text-[10px] font-medium" style={{ color: "hsl(0 0% 45%)" }}>채점 결과</span>
        <div className="flex items-end justify-between mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>{score}</span>
            <span className="text-sm font-medium" style={{ color: "hsl(0 0% 45%)" }}>/ {answers.length}</span>
          </div>
          <span className="text-xs font-bold" style={{ color: "hsl(11 82% 54%)" }}>{Math.round((score / answers.length) * 100)}점</span>
        </div>
      </div>

      {/* 답안 비교 */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid hsl(0 0% 90%)" }}>
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ background: "hsl(0 0% 96%)", borderBottom: "1px solid hsl(0 0% 90%)" }}>
              <th className="px-2 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>번호</th>
              <th className="px-2 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>내 답</th>
              <th className="px-2 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>정답</th>
              <th className="px-2 py-1.5 text-center font-semibold" style={{ color: "hsl(0 0% 45%)" }}>결과</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a) => (
              <tr key={a.num} style={{ borderBottom: "1px solid hsl(0 0% 95%)" }}>
                <td className="px-2 py-1.5 text-center font-medium tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>{a.num}</td>
                <td className="px-2 py-1.5 text-center tabular-nums" style={{ color: a.ok ? "hsl(0 0% 14%)" : "hsl(0 72% 51%)", fontWeight: a.ok ? 400 : 700 }}>
                  ⓐ{a.my}
                </td>
                <td className="px-2 py-1.5 text-center tabular-nums" style={{ color: "hsl(0 0% 14%)" }}>ⓐ{a.correct}</td>
                <td className="px-2 py-1.5 text-center">
                  {a.ok ? (
                    <span className="font-bold" style={{ color: "hsl(142 72% 40%)" }}>○</span>
                  ) : (
                    <span className="font-bold" style={{ color: "hsl(0 72% 51%)" }}>✕</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 자동 등록 알림 */}
      <div className="rounded-lg p-2.5 space-y-1.5" style={{ background: "hsl(142 72% 40% / 0.06)", border: "1px solid hsl(142 72% 40% / 0.15)" }}>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3" style={{ color: "hsl(142 72% 40%)" }} />
          <span className="text-[10px] font-bold" style={{ color: "hsl(142 72% 40%)" }}>자동 완료</span>
        </div>
        <p className="text-[9px]" style={{ color: "hsl(0 0% 45%)" }}>
          오답 3번, 25번이 회독표에 기록되고<br />복습 일정에 자동 등록되었습니다.
        </p>
      </div>

      {/* 입력 UI */}
      <div className="rounded-lg p-3" style={{ background: "hsl(0 0% 96%)", border: "1px solid hsl(0 0% 90%)" }}>
        <p className="text-[10px] font-medium mb-1.5" style={{ color: "hsl(0 0% 45%)" }}>답 입력</p>
        <div className="rounded-md px-3 py-1.5 text-xs font-mono" style={{ border: "1px solid hsl(0 0% 85%)", background: "hsl(0 0% 100%)", color: "hsl(0 0% 14%)" }}>
          3, 1, 4, 2, 1
        </div>
        <p className="text-[9px] mt-1" style={{ color: "hsl(0 0% 55%)" }}>
          답을 입력하면 채점 → 기록 → 복습 등록까지 한번에
        </p>
      </div>
    </div>
  );
}

/* ─── Main Mockup Component ─── */
const SCREENS = [MockCrossBook, MockPeerCompare, MockWrongFilter, MockGrowth, MockGrading];

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
