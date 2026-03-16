import { useNavigate } from "react-router-dom";
import { MessageCircle, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.svg";
import xycleWordmark from "@/assets/xycle-wordmark.svg";
import xycleLogomark from "@/assets/xycle-logomark.svg";
import GradingDemo from "@/components/GradingDemo";
import CookieConsent from "@/components/CookieConsent";
import AppMockup from "@/components/AppMockup";

const reviewCardsData = [
  { num: "01", title: "오답만 모아보기", desc: "틀린 문제만 골라서\n한 번에 복습할 수 있습니다" },
  { num: "02", title: "주제별 크로스 필터", desc: "교재가 달라도 같은 주제에서\n틀린 문제를 전부 볼 수 있습니다" },
  { num: "03", title: "회차별·횟수별 정렬", desc: "원하는 회차만, 자주 틀리는 순으로\n추려서 확인할 수 있습니다" },
];

function ReviewCardItem({ item, i, isLightMode, monoFont }: { item: typeof reviewCardsData[0]; i: number; isLightMode: boolean; monoFont: string }) {
  return (
    <motion.div
      key={item.num}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.15 }}
      className="rounded-2xl p-6 h-full"
      style={{
        backgroundColor: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
        transition: "background-color 0.8s ease, border-color 0.8s ease"
      }}
    >
      <span style={{
        fontFamily: monoFont,
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.15em",
        color: isLightMode ? "rgba(51,51,51,0.3)" : "rgba(236,236,236,0.3)",
        transition: "color 0.8s ease"
      }}>
        {item.num}
      </span>
      <h4 style={{
        color: isLightMode ? "#222222" : "#ECECEC",
        fontSize: "1.15rem",
        fontWeight: 700,
        marginTop: "14px",
        letterSpacing: "-0.02em",
        transition: "color 0.8s ease"
      }}>
        {item.title}
      </h4>
      <p style={{
        color: isLightMode ? "rgba(51,51,51,0.65)" : "rgba(236,236,236,0.55)",
        fontSize: "0.9rem",
        fontWeight: 300,
        lineHeight: 1.65,
        letterSpacing: "-0.02em",
        marginTop: "10px",
        whiteSpace: "pre-line" as const,
        transition: "color 0.8s ease"
      }}>
        {item.desc}
      </p>
    </motion.div>
  );
}

function ReviewCardsSection({ isLightMode, monoFont }: { isLightMode: boolean; monoFont: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <>
      <div className="hidden md:grid grid-cols-3 gap-6">
        {reviewCardsData.map((item, i) => (
          <ReviewCardItem key={item.num} item={item} i={i} isLightMode={isLightMode} monoFont={monoFont} />
        ))}
      </div>
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {reviewCardsData.map((item, i) => (
              <div key={item.num} className="flex-[0_0_85%] min-w-0">
                <ReviewCardItem item={item} i={i} isLightMode={isLightMode} monoFont={monoFont} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {reviewCardsData.map((_, i) => (
            <button
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: selectedIndex === i
                  ? (isLightMode ? "rgba(51,51,51,0.6)" : "rgba(236,236,236,0.6)")
                  : (isLightMode ? "rgba(51,51,51,0.15)" : "rgba(236,236,236,0.15)")
              }}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default function StudentLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [loadPercent, setLoadPercent] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [isFeatureInView, setIsFeatureInView] = useState(false);
  const [isDemoInView, setIsDemoInView] = useState(false);
  const [isCtaInView, setIsCtaInView] = useState(false);
  const [hasPassedAbout, setHasPassedAbout] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showBgLogo, setShowBgLogo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFeatureInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    const el = demoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsDemoInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCtaInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setHasPassedAbout(true);},
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
    const handleScroll = () => {
      const aboutEl = aboutRef.current;
      const ctaEl = ctaRef.current;
      if (!aboutEl || !ctaEl) return;
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      const aboutTop = aboutEl.offsetTop;
      const ctaTop = ctaEl.offsetTop;
      setShowBgLogo(scrollY >= aboutTop && scrollY < ctaTop);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {window.scrollTo(0, 0);setPhase("ready");}, 400);
      }
      setLoadPercent(Math.min(Math.round(current), 100));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      toast({ title: "로그인 실패", description: error.message, variant: "destructive" });
    }
  };

  const monoFont = "'IBM Plex Mono', 'Pretendard Variable', Pretendard, monospace";
  const isLightMode = isDemoInView;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: isLightMode ? "#ECECEC" : "#333333", fontFamily: monoFont, transition: "background 0.8s ease" }}>
      {/* Film grain noise overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none" style={{ opacity: 0.25 }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* Fixed Background Logo */}
      <AnimatePresence>
        {showBgLogo && (
          <motion.div
            key="bg-logo"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1] flex items-center justify-center pointer-events-none"
          >
            <img
              src={xycleLogomark}
              alt=""
              style={{
                width: "min(55vw, 55vh)",
                height: "auto",
                opacity: isLightMode ? 0.06 : 0.04,
                filter: isLightMode
                  ? "sepia(1) saturate(5) hue-rotate(-10deg) brightness(1.1)"
                  : "brightness(0) invert(1) opacity(0.5)",
                transition: "opacity 0.8s ease, filter 0.8s ease",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preloader */}
      <AnimatePresence>
        {phase === "loading" &&
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#333333" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(236,236,236,0.12)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px]">
              <div className="relative h-px w-full" style={{ background: "rgba(236,236,236,0.15)" }}>
                <motion.div
                  className="absolute top-0 left-0 h-full"
                  style={{ background: "#ECECEC" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadPercent}%` }}
                  transition={{ duration: 0.1 }} />
              </div>
              <div className="mt-3 text-center" style={{ color: "#ECECEC", fontSize: "13px", fontWeight: 300, letterSpacing: "0.05em" }}>
                {loadPercent}%
              </div>
            </div>
            <div className="absolute bottom-32 flex flex-col items-center gap-1">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ color: "rgba(236,236,236,0.5)", fontSize: "14px", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                make
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ color: "rgba(236,236,236,0.5)", fontSize: "14px", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                your
              </motion.span>
            </div>
            <motion.img
              src={logo}
              alt="Xycle"
              className="absolute bottom-12"
              style={{ height: "28px", opacity: 0.7 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.8 }} />
          </motion.div>
        }
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {phase === "ready" &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="min-h-screen relative">

            <div className="fixed top-0 bottom-0 left-1/2 w-px z-10" style={{ background: "rgba(236,236,236,0.08)" }} />

            {/* Hero Section */}
            <section ref={heroRef} className="min-h-[100svh] relative flex flex-col" style={{ background: "#333333" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center justify-between px-6 sm:px-10 py-4 relative"
                style={{ borderBottom: "1px solid rgba(236,236,236,0.08)" }}>
                <motion.img src={logo} alt="Xycle" style={{ height: "22px", opacity: 0.9 }} />
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={handleGoogleLogin}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      color: "#ECECEC",
                      fontSize: "11px",
                      fontWeight: 400,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontFamily: monoFont,
                      background: "none",
                      border: "1px solid rgba(236,236,236,0.2)",
                      padding: "6px 16px",
                      cursor: "pointer",
                      borderRadius: "9999px",
                    }}
                    className="hover:bg-white/10 hover:border-white/40 active:bg-white/20 transition-all duration-200">
                    로그인
                  </motion.button>
                  <motion.a
                    href="https://melodious-virgo-658.notion.site/Xycle-31e519deaa6280aab38bce598fbfe718?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      color: "rgba(236,236,236,0.55)",
                      fontSize: "11px",
                      fontWeight: 400,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      fontFamily: monoFont,
                      background: "none",
                      border: "1px solid rgba(236,236,236,0.2)",
                      padding: "6px 16px",
                      cursor: "pointer",
                      textDecoration: "none",
                      borderRadius: "9999px",
                    }}
                    className="hover:bg-white/10 hover:border-white/40 active:bg-white/20 transition-all duration-200">
                    도움말
                  </motion.a>
                </div>
              </motion.div>

              {/* Main Grid Content */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] relative">
                {/* Left Column */}
                <div className="px-5 sm:px-10 pt-6 sm:pt-16 flex flex-col gap-6 sm:gap-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}>
                    <h2 style={{
                      color: "#ECECEC",
                      fontSize: "clamp(1.95rem, 5vw, 3.5rem)",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                      letterSpacing: "-0.04em",
                    }}>
                      오늘 동차생 평균 18문제.<br />나는<span className="text-primary">?</span>
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="flex flex-col gap-6 -mt-4 sm:-mt-6">
                    <p style={{ color: "rgba(236,236,236,0.55)", fontSize: "15px", fontWeight: 400, fontFamily: "'Pretendard Variable', Pretendard, sans-serif", letterSpacing: "-0.03em", lineHeight: 1.6 }}>
                      같은 교재를 푸는 수험생들과<br className="sm:hidden" /> 나의 풀이량을 비교하세요
                    </p>
                    <motion.button
                      onClick={handleGoogleLogin}
                      whileHover={{ scaleX: 1.05, scaleY: 0.96 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        alignSelf: "flex-start",
                        gap: "10px",
                        background: "#ECECEC",
                        color: "#EA5027",
                        border: "none",
                        padding: "12px 28px",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                        cursor: "pointer",
                        borderRadius: "9999px",
                      }}>
                      Google로 시작하기
                      <span style={{ fontSize: "16px" }}>→</span>
                    </motion.button>
                  </motion.div>
                </div>

                {/* Right Column — Demo Cards */}
                <div className="px-5 sm:px-10 pt-2 sm:pt-12 flex flex-col gap-1.5 sm:gap-3">
                  {[
                    {
                      id: "rank",
                      label: "내 등수",
                      content: (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span style={{ fontSize: "36px", fontWeight: 800, color: "#ECECEC", fontFamily: "'Pretendard Variable', Pretendard, sans-serif", lineHeight: 1, letterSpacing: "-0.04em" }}>
                                16
                              </span>
                              <span style={{ fontSize: "16px", fontWeight: 400, color: "rgba(236,236,236,0.35)", fontFamily: monoFont }}>/</span>
                              <span style={{ fontSize: "18px", fontWeight: 500, color: "rgba(236,236,236,0.5)", fontFamily: monoFont }}>132</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span style={{ fontSize: "14px", color: "rgba(236,236,236,0.6)", fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}>38점</span>
                              <span style={{ fontSize: "14px", color: "#EA5027", fontWeight: 600, fontFamily: monoFont }}>상위 12%</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 600, fontFamily: monoFont }}>▲ +5점</span>
                            <span style={{ fontSize: "11px", color: "#4ade80", fontFamily: monoFont, background: "rgba(74,222,128,0.08)", padding: "2px 8px", borderRadius: "9999px", border: "1px solid rgba(74,222,128,0.15)" }}>성장 중! 🔥</span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "ranking",
                      label: "실시간 랭킹",
                      content: (
                        <div className="space-y-1">
                          {[
                            { rank: 1, name: "김○현", score: "47/50", pct: "상위 2%" },
                            { rank: 2, name: "이○준", score: "45/50", pct: "상위 5%" },
                          ].map((r) => (
                            <div key={r.rank} className="flex items-center gap-3" style={{ padding: "5px 10px", borderRadius: "8px", background: r.rank === 1 ? "rgba(234,80,39,0.08)" : "transparent", border: r.rank === 1 ? "1px solid rgba(234,80,39,0.2)" : "1px solid transparent" }}>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: r.rank === 1 ? "#EA5027" : "rgba(236,236,236,0.4)", fontFamily: monoFont, minWidth: "16px", fontVariantNumeric: "tabular-nums" }}>{r.rank}</span>
                              <span style={{ fontSize: "14px", color: "#ECECEC", fontWeight: 500, flex: 1 }}>{r.name}</span>
                              <span style={{ fontSize: "13px", color: "rgba(236,236,236,0.5)", fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}>{r.score}</span>
                              <span style={{ fontSize: "11px", color: "rgba(236,236,236,0.3)", fontFamily: monoFont }}>{r.pct}</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-3" style={{ padding: "5px 10px", borderRadius: "8px", background: "rgba(234,80,39,0.04)", border: "1px solid rgba(234,80,39,0.12)" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#EA5027", fontFamily: monoFont, minWidth: "16px", fontVariantNumeric: "tabular-nums" }}>16</span>
                            <span style={{ fontSize: "14px", color: "#EA5027", fontWeight: 600, flex: 1 }}>나</span>
                            <span style={{ fontSize: "13px", color: "rgba(234,80,39,0.7)", fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}>38/50</span>
                            <span style={{ fontSize: "11px", color: "rgba(234,80,39,0.5)", fontFamily: monoFont }}>상위 12%</span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "accuracy",
                      label: "정답률 분석",
                      content: (
                        <div className="space-y-2">
                          {[
                            { subject: "민법총칙", accuracy: 85, change: 12 },
                            { subject: "물권법", accuracy: 72, change: 8 },
                            { subject: "채권법", accuracy: 64, change: 15 },
                          ].map((s) => (
                            <div key={s.subject} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span style={{ fontSize: "13px", color: "rgba(236,236,236,0.7)" }}>{s.subject}</span>
                                <div className="flex items-center gap-2">
                                  <span style={{ fontSize: "13px", color: "#ECECEC", fontWeight: 600, fontFamily: monoFont, fontVariantNumeric: "tabular-nums" }}>{s.accuracy}%</span>
                                  <span style={{ fontSize: "11px", color: "#4ade80", fontFamily: monoFont }}>+{s.change}%</span>
                                </div>
                              </div>
                              <div style={{ height: "3px", borderRadius: "2px", background: "rgba(236,236,236,0.08)", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${s.accuracy}%`, borderRadius: "2px", background: "linear-gradient(90deg, #EA5027, #EA5027cc)" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ),
                    },
                  ].map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
                      className="group p-2 px-3 sm:p-3 sm:px-4"
                      style={{
                        background: "rgba(236,236,236,0.03)",
                        border: "1px solid rgba(236,236,236,0.08)",
                        borderRadius: "14px",
                        cursor: "default",
                        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(236,236,236,0.06)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(234,80,39,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(236,236,236,0.03)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(236,236,236,0.08)";
                      }}
                    >
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(236,236,236,0.35)",
                        fontFamily: monoFont,
                        display: "block",
                        marginBottom: "10px",
                      }}>
                        {card.label}
                      </span>
                      {card.content}
                    </motion.div>
                  ))}
                </div>

                {/* Vertical divider */}
                <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(236,236,236,0.08)" }} />
              </div>

              {/* Large Bottom Logo */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="px-5 sm:px-10 pb-4 mt-auto pt-6 sm:pt-0">
                <img
                  src={xycleWordmark}
                  alt="Xycle"
                  style={{ height: "clamp(3rem, 14vw, 12rem)", width: "auto" }} />
              </motion.div>

              {/* Bottom Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-between px-6 sm:px-10 py-3"
                style={{ borderTop: "1px solid rgba(236,236,236,0.08)" }}>
                <span style={{ color: "rgba(236,236,236,0.25)", fontSize: "10px", fontWeight: 400, fontFamily: monoFont, letterSpacing: "0.05em" }}>
                  rank · review · repeat
                </span>
                <span style={{ color: "rgba(236,236,236,0.25)", fontSize: "10px", fontWeight: 400, fontFamily: monoFont, letterSpacing: "0.05em" }}>
                  © 2026 Xycle
                </span>
              </motion.div>
            </section>

            {/* About Section */}
            <section ref={aboutRef} className="px-5 sm:px-10 lg:px-20 py-20 sm:py-52 relative">
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6">
                  <span style={{ color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: monoFont, transition: "color 0.8s ease" }}>
                    [ about ]
                  </span>
                  <h3 style={{
                    color: isLightMode ? "#222222" : "#ECECEC",
                    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                    letterSpacing: "-0.04em",
                    transition: "color 0.8s ease"
                  }}>
                    종이 회독표는 이제 그만.<br />
                    <span style={{ color: "#EA5027", transition: "color 0.8s ease" }}>Xycle로 기록하세요</span>
                  </h3>
                  <p style={{ color: isLightMode ? "rgba(51,51,51,0.55)" : "rgba(236,236,236,0.6)", fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)", fontWeight: 400, lineHeight: 1.7, letterSpacing: "-0.025em", fontFamily: "'Pretendard Variable', Pretendard, sans-serif", transition: "color 0.8s ease" }}>
                    같은 교재를 푸는 학생들과 경쟁하고, 내 <strong style={{ fontWeight: 700, color: "#EA5027" }}>현재 등수</strong>를 확인하세요. Xycle이 성적을 분석해서 <strong style={{ fontWeight: 700, color: "#EA5027" }}>부족한 부분</strong>이 어디인지, 어떤 문제들로 그것을 극복해낼 수 있는지 모든 방법을 알려드릴게요.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    <div
                      className="rounded-2xl p-5 sm:p-6"
                      style={{
                        backgroundColor: isLightMode ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"}`,
                        backdropFilter: "blur(20px)",
                        transition: "all 0.8s ease",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span style={{
                          color: isLightMode ? "#222" : "#ECECEC",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          transition: "color 0.8s ease",
                        }}>
                          실시간 랭킹
                        </span>
                      </div>
                      <p style={{
                        color: isLightMode ? "rgba(51,51,51,0.5)" : "rgba(236,236,236,0.45)",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        marginBottom: "16px",
                        transition: "color 0.8s ease",
                      }}>
                        총 128명 중 <span style={{ color: "#EA5027", fontWeight: 700 }}>12등</span>
                      </p>

                      <div className="space-y-1.5">
                        {[
                          { rank: 1, name: "수험생A", score: 38, medal: "🥇" },
                          { rank: 2, name: "수험생B", score: 37, medal: "🥈" },
                          { rank: 3, name: "수험생C", score: 36, medal: "🥉" },
                          { rank: 4, name: "수험생D", score: 35, medal: null },
                          { rank: 5, name: "수험생E", score: 34, medal: null },
                        ].map((entry, idx) => (
                          <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.4 + idx * 0.08 }}
                            className="flex items-center justify-between rounded-xl px-4 py-2.5"
                            style={{
                              backgroundColor: isLightMode ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)",
                              transition: "background-color 0.8s ease",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span style={{
                                width: "28px",
                                textAlign: "center",
                                fontWeight: 700,
                                fontSize: entry.medal ? "1.1rem" : "0.85rem",
                                color: isLightMode ? "rgba(51,51,51,0.4)" : "rgba(236,236,236,0.4)",
                                fontVariantNumeric: "tabular-nums",
                              }}>
                                {entry.medal || entry.rank}
                              </span>
                              <span style={{
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                color: isLightMode ? "#333" : "#ECECEC",
                                transition: "color 0.8s ease",
                              }}>
                                {entry.name}
                              </span>
                            </div>
                            <span style={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: isLightMode ? "rgba(51,51,51,0.5)" : "rgba(236,236,236,0.45)",
                              fontVariantNumeric: "tabular-nums",
                              transition: "color 0.8s ease",
                            }}>
                              {entry.score}/40
                            </span>
                          </motion.div>
                        ))}

                        <div className="flex justify-center py-1.5 gap-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-1 h-1 rounded-full"
                              style={{
                                backgroundColor: isLightMode ? "rgba(51,51,51,0.15)" : "rgba(236,236,236,0.15)",
                              }}
                            />
                          ))}
                        </div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                          className="flex items-center justify-between rounded-xl px-4 py-2.5"
                          style={{
                            backgroundColor: isLightMode ? "rgba(234,80,39,0.06)" : "rgba(234,80,39,0.12)",
                            border: `1px solid ${isLightMode ? "rgba(234,80,39,0.15)" : "rgba(234,80,39,0.25)"}`,
                            transition: "all 0.8s ease",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span style={{
                              width: "28px",
                              textAlign: "center",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: "#EA5027",
                              fontVariantNumeric: "tabular-nums",
                            }}>
                              12
                            </span>
                            <span style={{
                              fontSize: "0.9rem",
                              fontWeight: 700,
                              color: isLightMode ? "#222" : "#ECECEC",
                              transition: "color 0.8s ease",
                            }}>
                              나
                            </span>
                            <span
                              className="text-[10px] rounded-full px-2 py-0.5 font-semibold"
                              style={{
                                backgroundColor: isLightMode ? "rgba(234,80,39,0.1)" : "rgba(234,80,39,0.2)",
                                color: "#EA5027",
                              }}
                            >
                              ME
                            </span>
                          </div>
                          <span style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#EA5027",
                            fontVariantNumeric: "tabular-nums",
                          }}>
                            32/40
                          </span>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                        className="flex flex-col items-center mt-5 gap-1"
                      >
                        <div
                          className="inline-flex items-center gap-2 text-sm rounded-full px-5 py-2"
                          style={{
                            backgroundColor: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                            border: `1px solid ${isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
                            transition: "all 0.8s ease",
                          }}
                        >
                          <Trophy className="h-3.5 w-3.5" style={{ color: isLightMode ? "rgba(51,51,51,0.4)" : "rgba(236,236,236,0.4)" }} />
                          <span style={{ color: isLightMode ? "rgba(51,51,51,0.5)" : "rgba(236,236,236,0.45)", fontSize: "0.8rem", transition: "color 0.8s ease" }}>전체</span>
                          <span style={{ color: isLightMode ? "#222" : "#ECECEC", fontWeight: 700, fontSize: "0.8rem", transition: "color 0.8s ease" }}>128명</span>
                          <span style={{ color: isLightMode ? "rgba(51,51,51,0.5)" : "rgba(236,236,236,0.45)", fontSize: "0.8rem", transition: "color 0.8s ease" }}>중</span>
                          <span style={{ color: "#EA5027", fontWeight: 700, fontSize: "0.8rem" }}>12등</span>
                          <span style={{ color: isLightMode ? "rgba(51,51,51,0.15)" : "rgba(236,236,236,0.15)", fontSize: "0.8rem" }}>·</span>
                          <span style={{ color: isLightMode ? "#222" : "#ECECEC", fontWeight: 600, fontSize: "0.8rem", transition: "color 0.8s ease" }}>상위 9%</span>
                        </div>
                        <span style={{
                          color: isLightMode ? "rgba(51,51,51,0.3)" : "rgba(236,236,236,0.25)",
                          fontSize: "10px",
                          transition: "color 0.8s ease",
                        }}>
                          샘플 데이터입니다
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Assets Section */}
            <section className="px-5 sm:px-10 lg:px-20 py-16 sm:py-32 relative" style={{ background: isLightMode ? "#ECECEC" : "#333333", transition: "background 0.8s ease" }}>
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-20">
                  <div className="space-y-4">
                    <span style={{ color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: monoFont, transition: "color 0.8s ease" }}>
                      [ assets ]
                    </span>
                    <h3 style={{
                      color: isLightMode ? "#222222" : "#ECECEC",
                      fontSize: "clamp(1.8rem, 4vw, 3rem)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                      letterSpacing: "-0.03em",
                      transition: "color 0.8s ease"
                    }}>
                      같은 교재를 푸는 <span style={{ color: "#EA5027" }}>동차생들</span> 사이,{'\n'}<br />나는 몇 문제?
                    </h3>
                  </div>
                  <div className="space-y-4 lg:pt-[calc(11px*1.5+1rem)]">
                    <p style={{
                      color: isLightMode ? "rgba(51,51,51,0.8)" : "hsl(0 0% 100%)",
                      fontSize: "clamp(0.88rem, 1.5vw, 1.1rem)",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      letterSpacing: "-0.025em",
                      fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                      maxWidth: "400px",
                      transition: "color 0.8s ease"
                    }}>
                      <span style={{ fontWeight: 700, color: "#EA5027" }}>대한민국 회계학, 세법 1타 강사</span> <span style={{ fontWeight: 700 }}>오정화 선생님</span>의 검증된 교재들이 Xycle에 등록되어 있습니다. 동일한 교재를 푸는 수험생들과 나를 비교하고 부족한 부분을 점검하세요.
                    </p>
                    <div
                      className="inline-flex items-center gap-3 px-5 py-3 group/free cursor-pointer"
                      style={{
                        background: isLightMode ? "rgba(234,80,39,0.08)" : "rgba(234,80,39,0.15)",
                        border: `1px solid ${isLightMode ? "rgba(234,80,39,0.2)" : "rgba(234,80,39,0.3)"}`,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        borderRadius: "9999px",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.background = "rgba(234,80,39,1)";
                        el.style.borderColor = "rgba(234,80,39,1)";
                        el.style.boxShadow = "0 0 24px rgba(234,80,39,0.4), 0 0 48px rgba(234,80,39,0.15)";
                        el.style.transform = "translateY(-1px)";
                        const spans = el.querySelectorAll("span");
                        spans.forEach(s => (s as HTMLElement).style.color = "#FFFFFF");
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.background = isLightMode ? "rgba(234,80,39,0.08)" : "rgba(234,80,39,0.15)";
                        el.style.borderColor = isLightMode ? "rgba(234,80,39,0.2)" : "rgba(234,80,39,0.3)";
                        el.style.boxShadow = "none";
                        el.style.transform = "translateY(0)";
                        const spans = el.querySelectorAll("span");
                        (spans[0] as HTMLElement).style.color = "#EA5027";
                        (spans[1] as HTMLElement).style.color = isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.7)";
                      }}>
                      <span style={{
                        color: "#EA5027",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        fontFamily: monoFont,
                        transition: "color 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}>
                        FREE
                      </span>
                      <span style={{
                        color: isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.7)",
                        fontSize: "12px",
                        fontWeight: 400,
                        fontFamily: monoFont,
                        transition: "color 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}>
                        오정화 강사 수강생 전원 무료 이용
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { num: "01", title: "2026 오정화 회계학 실전 동형모의고사", author: "오정화", subject: "회계학", exams: 12, questions: 20 },
                    { num: "02", title: "2026 오정화 세법 실전동형 모의고사", author: "오정화", subject: "세법", exams: 12, questions: 20 },
                    { num: "03", title: "세무사 1차 실전모의고사 세법학개론", author: "오정화", subject: "세법", exams: 5, questions: 40 },
                  ].map((book, i) => (
                    <motion.div
                      key={book.num}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="group relative"
                      style={{
                        background: isLightMode ? "#FFFFFF" : "rgba(236,236,236,0.03)",
                        border: `1px solid ${isLightMode ? "rgba(51,51,51,0.08)" : "rgba(236,236,236,0.08)"}`,
                        transition: "all 0.4s ease"
                      }}>
                      <div
                        className="px-6 py-4 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${isLightMode ? "rgba(51,51,51,0.06)" : "rgba(236,236,236,0.06)"}` }}>
                        <span style={{ color: isLightMode ? "rgba(51,51,51,0.3)" : "rgba(236,236,236,0.25)", fontSize: "11px", fontWeight: 500, fontFamily: monoFont, letterSpacing: "0.05em" }}>
                          {book.num}
                        </span>
                        <span style={{ color: "#EA5027", fontSize: "10px", fontWeight: 600, fontFamily: monoFont, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {book.subject}
                        </span>
                      </div>
                      <div className="px-6 py-8 space-y-6">
                        <h4 style={{ color: isLightMode ? "#222222" : "#ECECEC", fontSize: "16px", fontWeight: 600, fontFamily: monoFont, lineHeight: 1.4, letterSpacing: "-0.02em", minHeight: "44px", transition: "color 0.4s ease" }}>
                          {book.title}
                        </h4>
                        <div className="flex items-center gap-6">
                          <div className="space-y-1">
                            <span style={{ color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: monoFont, display: "block" }}>AUTHOR</span>
                            <span style={{ color: isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.6)", fontSize: "13px", fontWeight: 500, fontFamily: monoFont }}>{book.author}</span>
                          </div>
                          <div className="space-y-1">
                            <span style={{ color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: monoFont, display: "block" }}>ROUNDS</span>
                            <span style={{ color: isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.6)", fontSize: "13px", fontWeight: 500, fontFamily: monoFont }}>{book.exams}회</span>
                          </div>
                          <div className="space-y-1">
                            <span style={{ color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: monoFont, display: "block" }}>Q/ROUND</span>
                            <span style={{ color: isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.6)", fontSize: "13px", fontWeight: 500, fontFamily: monoFont }}>{book.questions}문항</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "#EA5027" }} />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  style={{ borderTop: `1px solid ${isLightMode ? "rgba(51,51,51,0.08)" : "rgba(236,236,236,0.08)"}`, paddingTop: "24px" }}>
                  <p style={{ color: isLightMode ? "rgba(51,51,51,0.5)" : "rgba(236,236,236,0.4)", fontSize: "13px", fontWeight: 300, fontFamily: monoFont }}>
                    더 많은 교재가 곧 추가됩니다
                  </p>
                  <span style={{ color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.25)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: monoFont }}>
                    세무사 1차 · 회계학 · 세법
                  </span>
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <div
              ref={featuresRef}
              className="px-5 sm:px-10 lg:px-20 py-16 sm:py-32 relative">
              <div className="max-w-6xl mx-auto">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  style={{
                    color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)",
                    fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: monoFont,
                    transition: "color 0.8s ease",
                  }}>
                  [ features ]
                </motion.span>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                  <div className="space-y-0">
                    {[
                      { num: "01", title: "당신의 현재 등수부터", desc: "같은 교재를 푸는 학생들 중 내가 몇 등인지 바로 확인하세요.", mockupIdx: 0 },
                      { num: "02", title: "개인 복습 일정까지", desc: "검증된 간격 반복 알고리즘으로 틀린 문제를 완벽히 소화하세요.", mockupIdx: 1 },
                      { num: "03", title: "모든 성장을 추적합니다", desc: "어제의 나와 비교하며 매일 성장하는 과정을 데이터로 확인하세요.", mockupIdx: 2 },
                      { num: "04", title: "회독표", desc: "교재의 정오 기록이 깔끔하게 정리됩니다.", mockupIdx: 3 },
                      { num: "05", title: "복습 리스트", desc: "복습 주기에 맞춰 매일 복습할 문제를 자동으로 알려줍니다.", mockupIdx: 4 },
                    ].map((feature, i) => (
                      <React.Fragment key={feature.num}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: i * 0.08 }}
                          className="group flex items-start gap-6 sm:gap-10 py-8 border-t cursor-pointer"
                          style={{ borderColor: "rgba(255,255,255,0.08)" }}
                          onMouseEnter={() => setActiveFeature(feature.mockupIdx)}
                          onClick={() => setActiveFeature(feature.mockupIdx)}
                        >
                          <span style={{
                            color: activeFeature === feature.mockupIdx ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                            fontSize: "14px", fontWeight: 400, fontFamily: monoFont, minWidth: "2rem",
                            transition: "color 0.3s",
                          }}>
                            {feature.num}
                          </span>
                          <div className="flex-1">
                            <h4
                              className="group-hover:translate-x-2 transition-all duration-300"
                              style={{
                                color: activeFeature === feature.mockupIdx ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                                fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", fontWeight: 700, fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                                letterSpacing: "-0.02em",
                                transition: "color 0.3s",
                              }}>
                              {feature.title}
                            </h4>
                            <p style={{
                              color: activeFeature === feature.mockupIdx ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)",
                              fontSize: "15px", fontWeight: 300, fontFamily: "'Pretendard Variable', Pretendard, sans-serif", lineHeight: 1.65, marginTop: "8px",
                              letterSpacing: "-0.035em",
                              transition: "color 0.3s",
                            }}>
                              {feature.desc}
                            </p>
                          </div>
                        </motion.div>

                        <div className="lg:hidden pb-6">
                          {activeFeature === feature.mockupIdx && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <AppMockup activeFeature={feature.mockupIdx} />
                            </motion.div>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="hidden lg:block">
                    <div className="sticky top-32">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        <AppMockup activeFeature={activeFeature} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Science Section */}
            <div className="px-5 sm:px-10 lg:px-20 relative" style={{ paddingTop: "clamp(4rem, 10vw, 10rem)", paddingBottom: "clamp(4rem, 10vw, 10rem)" }}>
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <span style={{
                    color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)",
                    fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: monoFont,
                    transition: "color 0.8s ease"
                  }}>
                    [ review ]
                  </span>
                  <h3 style={{
                    color: isLightMode ? "#222222" : "#ECECEC",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    marginTop: "20px",
                    letterSpacing: "-0.03em",
                    transition: "color 0.8s ease"
                  }}>
                    시험 전날,<br />
                    <span style={{ color: "#EA5027" }}>뭘 봐야 할지</span><br />
                    저희가 골라드립니다
                  </h3>
                  <p style={{
                    color: isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.6)",
                    fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    letterSpacing: "-0.025em",
                    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                    marginTop: "28px",
                    maxWidth: "520px",
                    transition: "color 0.8s ease"
                  }}>
                    <span className="hidden sm:inline">망각 곡선 기반 간격 반복(Spaced Repetition) 알고리즘이</span>
                    <span className="sm:hidden">망각 곡선 기반 간격 반복 알고리즘이</span>
                    <br />
                    정답/오답 이력, 복습 횟수, 난이도를 분석하여<br />
                    <strong style={{ fontWeight: 700, color: isLightMode ? "#222222" : "#ECECEC" }}>
                      가장 잊혀질 확률이 높은 문제
                    </strong>
                    만 선별합니다.
                  </p>
                </motion.div>

                <ReviewCardsSection isLightMode={isLightMode} monoFont={monoFont} />
              </div>
            </div>

            {/* Demo Section */}
            <div
              ref={demoRef}
              className="px-5 sm:px-10 lg:px-20 relative"
              style={{ paddingTop: "clamp(4rem, 10vw, 10rem)", paddingBottom: "clamp(6rem, 15vw, 22rem)" }}>
              <div className="max-w-lg mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mb-8">
                  <span style={{
                    color: isLightMode ? "rgba(51,51,51,0.35)" : "rgba(236,236,236,0.3)",
                    fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: monoFont,
                    transition: "color 0.8s ease"
                  }}>
                    [ try it ]
                  </span>
                  <h3 style={{
                    color: isLightMode ? "#222222" : "#ECECEC",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    marginTop: "20px",
                    letterSpacing: "-0.03em",
                    transition: "color 0.8s ease"
                  }}>
                    직접 <span style={{ color: "#EA5027" }}>채점</span>해보세요
                  </h3>
                  <p style={{
                    color: isLightMode ? "rgba(51,51,51,0.7)" : "rgba(236,236,236,0.6)",
                    fontSize: "clamp(0.88rem, 1.5vw, 1.1rem)",
                    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    letterSpacing: "-0.025em",
                    marginTop: "28px",
                    maxWidth: "520px",
                    transition: "color 0.8s ease"
                  }}>
                    1~5번까지 답을 입력하면 채점, 랭킹, 복습 등록까지<br />
                    한번에 체험할 수 있어요.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}>
                  <GradingDemo />
                </motion.div>
              </div>
            </div>

            {/* Footer CTA */}
            <section
              ref={ctaRef}
              className="relative min-h-screen flex flex-col justify-between overflow-hidden"
              style={{ background: "linear-gradient(180deg, #EA5027 0%, #C43D1A 50%, #9A2F12 100%)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.2 }}>
                <svg width="100%" height="100%">
                  <filter id="grain-cta">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#grain-cta)" />
                </svg>
              </div>
              <div className="w-full h-px" style={{ background: "rgba(236,236,236,0.15)" }} />

              <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-20 py-12 sm:py-20">
                <div className="max-w-5xl mx-auto w-full">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                      color: "rgba(236,236,236,0.5)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: monoFont,
                      display: "block",
                      marginBottom: "40px"
                    }}>
                    [ start now ]
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      color: "#ECECEC",
                      fontSize: "clamp(2.5rem, 7vw, 6rem)",
                      fontWeight: 700,
                      fontFamily: monoFont,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.05,
                      textTransform: "uppercase"
                    }}>
                    지금
                    <br />
                    시작하세요_
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    style={{
                      color: "hsl(0 0% 93% / 0.67)",
                      fontSize: "14px",
                      fontWeight: 300,
                      fontFamily: monoFont,
                      lineHeight: 1.8,
                      marginTop: "32px",
                      maxWidth: "420px"
                    }}>
                    같은 교재를 푸는 학생들과 경쟁하고,<br className="sm:hidden" />
                    내 현재 등수를 확인하세요.
                  </motion.p>

                  <motion.button
                    onClick={handleGoogleLogin}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    whileHover={{ scaleX: 1.05, scaleY: 0.96 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "48px",
                      background: "#ECECEC",
                      color: "#EA5027",
                      border: "none",
                      padding: "14px 32px",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                      cursor: "pointer"
                    }}>
                    Google로 시작하기
                    <span style={{ fontSize: "16px" }}>→</span>
                  </motion.button>
                </div>
              </div>

              <div className="px-6 sm:px-10 lg:px-20 pb-8">
                <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2">
                    <span style={{ color: "rgba(236,236,236,0.4)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: monoFont }}>
                      CONTACT
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <p style={{ color: "rgba(236,236,236,0.7)", fontSize: "13px", fontWeight: 400, fontFamily: monoFont }}>
                        wiserlab1@gmail.com
                      </p>
                      <span style={{ color: "rgba(236,236,236,0.25)", fontSize: "13px", fontWeight: 300 }}>|</span>
                      <a
                        href="http://pf.kakao.com/_uSAyn"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="카카오톡 채널"
                        style={{ display: "inline-flex", alignItems: "center", color: "rgba(236,236,236,0.7)", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#FEE500")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(236,236,236,0.7)")}
                      >
                        <MessageCircle size={16} />
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-10">
                    {[{ label: "SERVICE", value: "RANK & REVIEW & REPEAT" }].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <span style={{ color: "rgba(236,236,236,0.35)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: monoFont, display: "block" }}>
                          {item.label}
                        </span>
                        <span style={{ color: "rgba(236,236,236,0.7)", fontSize: "12px", fontWeight: 500, fontFamily: monoFont }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div
                className="px-6 sm:px-10 py-5 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(236,236,236,0.15)" }}>
                <span style={{ color: "rgba(236,236,236,0.35)", fontSize: "11px", fontWeight: 300, fontFamily: monoFont }}>
                  © 2026 Xycle
                </span>
                <span style={{ color: "rgba(236,236,236,0.35)", fontSize: "11px", fontWeight: 300, fontFamily: monoFont, letterSpacing: "0.1em" }}>
                  rank · review · repeat
                </span>
              </div>
            </section>

          </motion.div>
        }
      </AnimatePresence>

      {/* Fixed Floating Nav Button */}
      <AnimatePresence>
        {phase === "ready" && !isHeroInView && hasPassedAbout && !isCtaInView &&
        <motion.div
          key="floating-btn-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 left-0 top-1/2 -translate-y-1/2 hidden sm:block"
          style={{ pointerEvents: "none" }}>
          <motion.button
            onClick={handleGoogleLogin}
            style={{
              color: "#ECECEC",
              background: "#EA5027",
              border: "none",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              cursor: "pointer",
              pointerEvents: "auto",
              padding: "14px 12px",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              whiteSpace: "nowrap"
            }}
            whileHover={{ paddingLeft: "16px", paddingRight: "16px" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            Google로 시작하기
          </motion.button>
        </motion.div>
        }
      </AnimatePresence>
      <CookieConsent />
    </div>
  );
}