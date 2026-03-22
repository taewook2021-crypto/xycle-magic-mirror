import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CookieConsent from "@/components/CookieConsent";

const features = [
  {
    num: "01",
    total: "04",
    title: "교재를 횡단하는 취약 분석",
    desc: "연습서에서 틀린 문제, 파이널에서 또 틀린 문제. 교재가 달라도 같은 주제에서 반복되는 약점을 자동으로 찾아 한 번에 보여드립니다.",
  },
  {
    num: "02",
    total: "04",
    title: "동차생과 비교하는 실시간 풀이량",
    desc: "혼자 종이를 풀면 내 위치를 알 수 없습니다. 같은 교재를 푸는 동차생·유예생 평균과 나의 풀이량을 실시간으로 비교하세요.",
  },
  {
    num: "03",
    total: "04",
    title: "N번 틀린 문제만 즉시 필터",
    desc: "종이는 처음부터 끝까지 다시 훑어야 합니다. 분개장은 2번 이상 틀린 문제만 터치 한 번으로 추려냅니다.",
  },
  {
    num: "04",
    total: "04",
    title: "입력하면 끝나는 간편 채점",
    desc: "답을 입력하면 채점, 기록, 오답 분류까지 한 번에 끝납니다. 별도의 채점표가 필요 없습니다.",
  },
];

const faqs = [
  {
    q: "분개장은 어떤 서비스인가요?",
    a: "분개장은 세무사·회계사 수험생을 위한 회독 관리 플랫폼입니다. 객관식 교재의 풀이 기록을 디지털화하여, 교재 횡단 취약 분석·동차생 풀이량 비교·오답 필터링 등 종이에서는 불가능한 기능을 제공합니다.",
  },
  {
    q: "어떤 교재가 지원되나요?",
    a: "현재 이승철 세무회계연습(법인세법, 소득세법, 부가가치세법, 상속증여세법), 세무사 1차 실전모의고사 등이 등록되어 있으며, 지속적으로 교재를 추가하고 있습니다.",
  },
  {
    q: "무료로 사용할 수 있나요?",
    a: "네. 분개장의 모든 핵심 기능(회독 기록, 채점, 오답 필터, 교재 횡단 분석)은 무료로 제공됩니다.",
  },
  {
    q: "내 풀이 데이터는 안전한가요?",
    a: "모든 데이터는 업계 표준 암호화를 적용하여 안전하게 관리됩니다. Google 계정 인증을 통해 본인만 데이터에 접근할 수 있습니다.",
  },
  {
    q: "모바일에서도 사용할 수 있나요?",
    a: "네. 분개장은 모바일 환경에 최적화되어 있어, 스마트폰에서도 편리하게 채점하고 기록을 확인할 수 있습니다.",
  },
];

const suggestionChips = [
  "세무회계연습 법인세법",
  "세무회계연습 소득세법",
  "실전 동형모의고사",
  "세법학개론",
];

function FAQItem({ item, isOpen, onClick }: { item: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      className="border-b"
      style={{ borderColor: "hsl(0 0% 0% / 0.08)" }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span
          className="text-lg font-semibold tracking-tight"
          style={{
            fontFamily: "'Airbnb Cereal', 'Pretendard Variable', Pretendard, sans-serif",
            color: "hsl(0 0% 13%)",
          }}
        >
          {item.q}
        </span>
        <span className="ml-4 flex-shrink-0 text-muted-foreground">
          {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p
              className="pb-6 leading-relaxed"
              style={{
                color: "hsl(0 0% 40%)",
                fontSize: "0.95rem",
                fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudentLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "로그인 실패", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Airbnb Cereal', 'Pretendard Variable', Pretendard, sans-serif",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F0C4EC 100%)",
      }}
    >
      {/* ───── Nav ───── */}
      <nav
        className="sticky top-0 z-50 py-3 px-4"
        style={{
          background: "linear-gradient(180deg, hsl(310 30% 93%) 0%, hsl(310 30% 93% / 0) 100%)",
        }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between px-5 h-12 rounded-full"
          style={{
            background: "hsl(0 0% 100% / 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid hsl(0 0% 0% / 0.06)",
            boxShadow: "0 1px 3px hsl(0 0% 0% / 0.04)",
          }}
        >
          <div className="flex items-center gap-6">
            <span className="text-base font-bold tracking-tight" style={{ color: "hsl(0 0% 10%)" }}>분개장</span>
            <a
              href="https://melodious-virgo-658.notion.site/Xycle-31e519deaa6280aab38bce598fbfe718"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-foreground"
              style={{ color: "hsl(0 0% 40%)" }}
            >
              도움말
            </a>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="rounded-full text-sm font-semibold px-5 py-2 transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "hsl(0 0% 13%)",
              color: "hsl(0 0% 94%)",
            }}
          >
            시작하기
          </button>
        </div>
      </nav>

      {/* ───── Hero Section ───── */}
      <section
        className="relative overflow-hidden -mt-[72px]"
        style={{
          background: "linear-gradient(180deg, hsl(310 30% 93%) 0%, hsl(305 25% 91%) 40%, hsl(0 0% 100%) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 pt-[calc(72px+5rem)] sm:pt-[calc(72px+8rem)] pb-24 sm:pb-40 text-center">
          {/* Announcement pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
            style={{
              background: "hsl(0 0% 94% / 0.7)",
              border: "1px solid hsl(0 0% 0% / 0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              className="text-xs font-bold rounded-full px-2.5 py-0.5"
              style={{
                background: "hsl(304 56% 66%)",
                color: "hsl(0 0% 94%)",
              }}
            >
              NEW
            </span>
            <span className="text-sm" style={{ color: "hsl(0 0% 25%)" }}>
              이승철 세무회계연습 전 과목 등록 완료
            </span>
            <ChevronRight className="h-4 w-4" style={{ color: "hsl(0 0% 50%)" }} />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            style={{
              color: "hsl(0 0% 10%)",
              fontFamily: "'Airbnb Cereal', 'Pretendard Variable', Pretendard, sans-serif",
              letterSpacing: "-0.04em",
              wordBreak: "keep-all",
            }}
          >
            종이 위에선 보이지 않던
            <br />
            나의 위치를 확인하세요
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl mb-10 mx-auto max-w-2xl"
            style={{
              color: "hsl(0 0% 35%)",
              lineHeight: 1.6,
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            분개장은 객관식 교재의 풀이 기록을 디지털화하여,
            <br className="hidden sm:block" />
            동차생 비교·교재 횡단 분석·오답 필터를 제공합니다.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={handleGoogleLogin}
            className="rounded-full text-base font-bold px-8 py-3.5 transition-all hover:opacity-90 active:scale-[0.97] mb-10"
            style={{
              background: "hsl(304 56% 66%)",
              color: "hsl(0 0% 94%)",
              boxShadow: "0 4px 20px hsl(304 56% 66% / 0.3)",
            }}
          >
            Google로 시작하기
          </motion.button>

          {/* Suggestion chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col items-center gap-3"
          >
            <p
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "hsl(0 0% 55%)" }}
            >
              지원 교재 미리보기
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestionChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full px-4 py-2 text-sm cursor-default transition-colors hover:bg-white/80"
                  style={{
                    border: "1px solid hsl(0 0% 0% / 0.1)",
                    color: "hsl(0 0% 25%)",
                    background: "hsl(0 0% 94% / 0.5)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── Features Section (Numbered like Base44) ───── */}
      <section
        className="py-20 sm:py-32"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, transparent 30%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-20 text-center"
            style={{
              color: "hsl(0 0% 10%)",
              letterSpacing: "-0.03em",
            }}
          >
            종이가 할 수 없는 것들
          </motion.h2>

          <div className="space-y-0">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 py-12 sm:py-16 border-t items-start"
                style={{ borderColor: "hsl(0 0% 0% / 0.08)" }}
              >
                {/* Left: image placeholder */}
                <div
                  className="rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/4]"
                  style={{
                    background: `linear-gradient(135deg, hsl(${14 + i * 30} 40% 95%) 0%, hsl(${14 + i * 30} 30% 90%) 100%)`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center space-y-4">
                      <div
                        className="text-5xl sm:text-6xl font-bold"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: `hsl(${14 + i * 30} 50% 65%)`,
                        }}
                      >
                        {f.num}
                      </div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: `hsl(${14 + i * 30} 30% 55%)` }}
                      >
                        {f.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: text */}
                <div className="flex flex-col justify-center py-4">
                  <div className="flex items-center gap-2 mb-6">
                    <span
                      className="text-sm font-medium"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "hsl(0 0% 50%)",
                      }}
                    >
                      {f.num}
                    </span>
                    <span style={{ color: "hsl(0 0% 75%)" }}>/</span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "hsl(0 0% 75%)",
                      }}
                    >
                      {f.total}
                    </span>
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
                    style={{
                      color: "hsl(0 0% 10%)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.2,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed mb-8"
                    style={{
                      color: "hsl(0 0% 40%)",
                      fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                      maxWidth: "440px",
                    }}
                  >
                    {f.desc}
                  </p>
                  <div>
                    <button
                      onClick={handleGoogleLogin}
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                      style={{ color: "hsl(304 56% 66%)" }}
                    >
                      시작하기
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ Section ───── */}
      <section
        className="py-20 sm:py-32"
        
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-12 text-center"
            style={{
              color: "hsl(0 0% 10%)",
              letterSpacing: "-0.03em",
            }}
          >
            자주 묻는 질문
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                item={faq}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section
        className="py-24 sm:py-40 text-center"
        
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-10"
            style={{
              color: "hsl(0 0% 10%)",
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
            }}
          >
            지금, 무엇을 풀고 계신가요?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              onClick={handleGoogleLogin}
              className="rounded-full text-base font-bold px-10 py-4 transition-all hover:opacity-90 active:scale-[0.97]"
              style={{
                background: "hsl(304 56% 66%)",
                color: "hsl(0 0% 94%)",
                boxShadow: "0 4px 20px hsl(304 56% 66% / 0.3)",
              }}
            >
              시작하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="py-8" />

    </div>
  );
}
