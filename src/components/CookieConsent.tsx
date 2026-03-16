import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_KEY = "xycle_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const monoFont = "'IBM Plex Mono', 'Pretendard Variable', Pretendard, monospace";

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[100] max-w-[320px]"
          style={{ fontFamily: monoFont }}
        >
          <div
            style={{
              background: "#2A2A2A",
              border: "1px solid rgba(236,236,236,0.1)",
              padding: "20px",
            }}
          >
            <span
              style={{
                color: "rgba(236,236,236,0.35)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              [ cookies ]
            </span>
            <p
              style={{
                color: "rgba(236,236,236,0.6)",
                fontSize: "12px",
                fontWeight: 300,
                lineHeight: 1.7,
                marginBottom: "16px",
              }}
            >
              이 웹사이트는 더 나은 경험을 위해 쿠키를 사용합니다. 계속 이용하시면 쿠키 사용에 동의하는 것으로 간주합니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                style={{
                  flex: 1,
                  background: "#ECECEC",
                  color: "#333333",
                  border: "none",
                  padding: "8px 0",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: monoFont,
                  cursor: "pointer",
                }}
              >
                수락
              </button>
              <button
                onClick={handleDecline}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "rgba(236,236,236,0.5)",
                  border: "1px solid rgba(236,236,236,0.15)",
                  padding: "8px 0",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: monoFont,
                  cursor: "pointer",
                }}
              >
                거절
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}