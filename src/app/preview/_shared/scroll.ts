"use client";

import { useEffect, useRef, useState } from "react";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** p가 a→b 구간을 지나는 동안 0→1 */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** 키 큰 섹션 안의 sticky 무대: 섹션을 지나가는 동안 0 → 1 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(clamp01(total > 0 ? -r.top / total : 0));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, p] as const;
}
