"use client";

import { useEffect, useState } from "react";

export const ACCENT = "#3182f6";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: "var(--nav-h)", left: 0, right: 0, height: "5px", zIndex: 49, pointerEvents: "none" }}>
      <div style={{ height: "100%", width: `${progress * 100}%`, background: ACCENT, borderRadius: "0 2px 2px 0" }} />
    </div>
  );
}
