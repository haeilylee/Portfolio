"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import type { Chapter, Motion, Scene, Visual } from "../_shared/story";
import { plainTitle } from "../_shared/story";
import { RichText, StoryStyles, VisualView } from "../_shared/ui";

const BLUE = "#3182f6";
const INK = "#191f28";

/* ── 스프링 → CSS linear() 이징 ─────────────────────────────
 * 토스 Simplicity 세션(how-to-measure-experience) 40장면을 프레임 단위로 기록해 환산했다.
 *  SETTLE  대부분의 이미지 : 96% 크기 · 16px 아래 → 제자리, 지나침 없음, 90% ≈270ms  → k 210, c 29 (임계감쇠)
 *  UNFOLD  넓은 이미지     : 아래 기준으로 펼쳐짐, 지나침 없음, 90% ≈560ms           → k 48,  c 13.9 (임계감쇠)
 *  POP     (드물게)        : 5% 지나침, 90% ≈230ms                                  → k 260, c 22 */
function spring(k: number, c: number, m = 1) {
  const dt = 1 / 240;
  let x = 0,
    v = 0,
    t = 0;
  const xs: number[] = [];
  while (t < 3) {
    const a = (-k * (x - 1) - c * v) / m;
    v += a * dt;
    x += v * dt;
    t += dt;
    xs.push(x);
    if (t > 0.1 && Math.abs(1 - x) < 0.0008 && Math.abs(v) < 0.002) break;
  }
  const n = 48;
  const pts = Array.from({ length: n + 1 }, (_, i) => +xs[Math.min(xs.length - 1, Math.round((i / n) * (xs.length - 1)))].toFixed(4));
  pts[n] = 1;
  return { easing: `linear(0, ${pts.slice(1).join(", ")})`, duration: Math.round(t * 1000) };
}
const SETTLE = spring(210, 29);
const UNFOLD = spring(48, 13.9);
const POP = spring(260, 22);
const EASE_OUT = "cubic-bezier(.2,.8,.2,1)";

/** Admin 이미지 블록 `motion` 값 — 비우면(auto) settle */
export type PlayerMotion = "auto" | "settle" | "unfold" | "pop" | "fade" | "none";
export const MOTION_LABEL: Record<PlayerMotion, string> = { auto: "자동", settle: "떠오름", unfold: "펼치기", pop: "팝", fade: "디졸브", none: "없음" };

function legacy(m?: Motion | string): PlayerMotion {
  if (m === "swoosh" || m === "zoom" || m === "pop") return "pop";
  if (m === "unfold" || m === "fade" || m === "none" || m === "settle") return m;
  return "auto";
}

/** 비주얼 등장: 마운트될 때 한 번, Web Animations API로 스프링 재생 */
function VisualEnter({ visual, motion, animate }: { visual: Visual; motion: PlayerMotion; animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.opacity = "0";
    let anims: Animation[] = [];
    const run = () => {
      const r = el.getBoundingClientRect();
      const m = motion === "auto" ? "settle" : motion; // 토스에서도 대부분의 이미지는 settle. 펼치기·팝은 Admin에서 고른 이미지에만
      el.style.opacity = "";
      if (m === "none") return;
      const fadeIn = (ms: number, from = 0) => el.animate([{ opacity: from }, { opacity: 1 }], { duration: ms, easing: EASE_OUT, fill: "both" });
      if (m === "settle") {
        el.style.transformOrigin = "50% 100%";
        anims = [el.animate([{ transform: "translateY(16px) scale(0.96)" }, { transform: "none" }], { duration: SETTLE.duration, easing: SETTLE.easing, fill: "both" }), fadeIn(260)];
      } else if (m === "unfold") {
        el.style.transformOrigin = "50% 100%"; // 아래(문장 쪽)를 기준으로 펼쳐 올라온다
        anims = [el.animate([{ transform: "scale(0.04)" }, { transform: "none" }], { duration: UNFOLD.duration, easing: UNFOLD.easing, fill: "both" }), fadeIn(220)];
      } else if (m === "pop") {
        el.style.transformOrigin = "50% 50%";
        anims = [el.animate([{ transform: "scale(0.3)" }, { transform: "none" }], { duration: POP.duration, easing: POP.easing, fill: "both" }), fadeIn(200)];
      } else {
        anims = [el.animate([{ opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "none" }], { duration: 500, easing: EASE_OUT, fill: "both" })];
      }
    };
    const img = el.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", run, { once: true });
    else run();
    return () => anims.forEach((a) => a.cancel());
  }, [animate, motion]);
  return (
    <div ref={ref} style={{ display: "inline-flex", maxWidth: "100%", willChange: "transform, opacity" }}>
      <VisualView visual={visual} tint="#eef2f8" />
    </div>
  );
}

/* ── 진행바: 챕터당 한 칸, 지금 칸은 장면마다 매끄럽게 차오른다 ── */
function Progress({ chapters, index, onPick }: { chapters: Chapter[]; index: number; onPick: (c: Chapter) => void }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {chapters.map((c) => {
        const fill = index >= c.first + c.count ? 1 : index < c.first ? 0 : (index - c.first + 1) / c.count;
        return (
          <button key={c.index} onClick={() => onPick(c)} title={c.title} style={{ flex: Math.max(1, c.count), padding: "8px 0", border: "none", background: "none", cursor: "pointer" }}>
            <div style={{ height: 2, borderRadius: 2, background: "rgba(49,130,246,.14)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: BLUE, transformOrigin: "0 50%", transform: `scaleX(${fill})`, transition: "transform .6s cubic-bezier(.33,1,.68,1)" }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── 챕터 메뉴: 뒤를 크게 블러하고 큰 목록을 띄운다 ── */
function ChapterOverlay({ chapters, current, anchorX, onPick, onClose }: { chapters: Chapter[]; current: number; anchorX: number; onPick: (c: Chapter) => void; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(255,255,255,.55)", backdropFilter: "blur(40px) saturate(1.2)", WebkitBackdropFilter: "blur(40px) saturate(1.2)", animation: "pl-fade .35s ease-out both" }}>
      <div style={{ position: "absolute", top: 124, left: anchorX, display: "flex", flexDirection: "column", gap: 26 }}>
        {chapters.map((c, i) => (
          <button
            key={c.index}
            onClick={(e) => {
              e.stopPropagation();
              onPick(c);
            }}
            style={{ textAlign: "left", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: c.index === current ? BLUE : "rgba(49,130,246,.45)", padding: 0, animation: `pl-item .5s ${60 + i * 40}ms ${EASE_OUT} both`, transition: "color .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = BLUE)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.index === current ? BLUE : "rgba(49,130,246,.45)")}
          >
            {String(c.index + 1).padStart(2, "0")}. {c.title}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * 상세 플레이어 (A안 확정 방향) — 토스 Simplicity 세션 기준, 라이트.
 * 레이아웃: 문장 블록은 가운데 고정(최대 800px, 줄은 왼쪽 정렬), 비주얼은 그 위 가운데.
 */
export default function Player({ project, scenes, chapters, back }: { project: Project; scenes: Scene[]; chapters: Chapter[]; back: string }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [menu, setMenu] = useState(false);
  const [force, setForce] = useState<PlayerMotion | "data">("data");
  const [replay, setReplay] = useState(0);
  const labelRef = useRef<HTMLButtonElement>(null);
  const [anchorX, setAnchorX] = useState(0);
  const lock = useRef(0);
  const touch = useRef<number | null>(null);

  const iRef = useRef(i);
  iRef.current = i;
  const go = useCallback(
    (n: number) => {
      const t = Math.max(0, Math.min(scenes.length - 1, n));
      if (t === iRef.current) return;
      setPrev(iRef.current);
      setI(t);
    },
    [scenes.length]
  );
  useEffect(() => {
    if (prev === null) return;
    const id = setTimeout(() => setPrev(null), 240);
    return () => clearTimeout(id);
  }, [prev, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menu) return;
      if (["ArrowRight", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        go(iRef.current + 1);
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        go(iRef.current - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (menu) return;
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 14 || Date.now() - lock.current < 520) return;
      lock.current = Date.now();
      go(iRef.current + (d > 0 ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [go, menu]);

  useEffect(() => {
    if (!playing) return;
    if (i >= scenes.length - 1) return setPlaying(false);
    const id = setTimeout(() => go(i + 1), 1800 + scenes[i].text.length * 40);
    return () => clearTimeout(id);
  }, [playing, i, scenes, go]);

  const s = scenes[i];
  const p = prev !== null ? scenes[prev] : null;
  const visualChanged = !p || p.visualKey !== s.visualKey || p.isCover !== s.isCover;
  const motionOf = (sc: Scene): PlayerMotion => (force !== "data" ? force : sc.visual.kind === "image" ? legacy(sc.visual.motion) : "settle");

  const IN_TEXT = `pl-in .5s .08s ${EASE_OUT} both`;

  const layer = (sc: Scene, idx: number, key: string, leaving: boolean, showVisual: boolean, animateVisual: boolean) => (
    <div key={key} style={{ position: "absolute", inset: 0, pointerEvents: "none", animation: leaving ? "pl-out .22s ease-in both" : undefined }}>
      {sc.isCover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: "46%", transform: "translateY(-50%)", textAlign: "center", padding: "0 24px", animation: leaving ? undefined : `pl-in .6s ${EASE_OUT} both` }}>
          <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontStyle: "italic", fontSize: "clamp(44px, 6.4vw, 96px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: BLUE }}>{sc.group ?? "Overview"}</div>
          <h2 style={{ margin: "22px auto 0", maxWidth: 760, fontSize: "clamp(22px, 2.4vw, 32px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.4, wordBreak: "keep-all", color: INK }}>{sc.text}</h2>
        </div>
      ) : (
        <>
          {/* 비주얼: 문장 위, 가운데 */}
          {showVisual && (
            <div style={{ position: "absolute", left: 24, right: 24, bottom: "calc(100% - var(--text-top) + 20px)", display: "flex", justifyContent: "center", ["--st-img-h" as string]: "46vh" }}>
              <VisualEnter key={`v-${sc.visualKey}-${force}-${replay}`} visual={sc.visual} motion={motionOf(sc)} animate={animateVisual} />
            </div>
          )}
          {/* 문장: 가운데 고정 (블록은 가운데, 줄은 왼쪽 정렬) */}
          <div style={{ position: "absolute", left: 24, right: 24, top: "var(--text-top)", display: "flex", justifyContent: "center" }}>
            <p key={`t-${idx}`} style={{ margin: 0, maxWidth: 800, textAlign: "left", fontSize: "clamp(20px, 1.9vw, 27px)", fontWeight: 700, lineHeight: 1.55, letterSpacing: "-0.035em", wordBreak: "keep-all", color: INK, animation: leaving ? undefined : IN_TEXT }}>
              <RichText text={sc.text} accent={BLUE} animate={!leaving} />
            </p>
          </div>
        </>
      )}
    </div>
  );

  const ch = chapters[s.chapter];
  const openMenu = () => {
    const r = labelRef.current?.getBoundingClientRect();
    setAnchorX(Math.max(24, Math.min(r ? r.left : window.innerWidth / 2, window.innerWidth - 680))); // 긴 챕터명이 잘리지 않게
    setMenu(true);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 30, color: INK, background: "radial-gradient(120% 65% at 50% 120%, #d9e6ff 0%, #eef3ff 36%, #ffffff 70%)" }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <StoryStyles />
      <style>{`
        @keyframes pl-in { from { opacity:0; transform: translateY(12px); filter: blur(6px); } to { opacity:1; transform:none; filter:none; } }
        @keyframes pl-out { to { opacity:0; transform: translateY(-6px); } }
        @keyframes pl-fade { from { opacity:0; } to { opacity:1; } }
        @keyframes pl-item { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
        .pl-zone-l { cursor: w-resize; } .pl-zone-r { cursor: e-resize; }
        .pl-ctl { width: 48px; height: 48px; border-radius: 99px; border: none; background: #fff; color: ${BLUE}; font-size: 18px; cursor: pointer; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 12px rgba(30,60,140,.08); transition: transform .15s; }
        .pl-ctl:hover { transform: scale(1.05); } .pl-ctl:active { transform: scale(.96); }
        .pl-ctl:disabled { opacity: .4; cursor: default; transform: none; }
        .pl-ghost { width: 48px; height: 48px; border-radius: 99px; border: none; background: #f2f4f6; color: #6b7684; font-size: 18px; cursor: pointer; display:flex; align-items:center; justify-content:center; text-decoration: none; }
      `}</style>

      {/* 상단: 진행바 + 제목 | 챕터 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 45, padding: "6px 32px 0" }}>
        <Progress chapters={chapters} index={i} onPick={(c) => go(c.first)} />
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 48px", alignItems: "center", marginTop: 10 }}>
          <Link href={back} aria-label="목록으로" className="pl-ghost">
            ‹
          </Link>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, minWidth: 0, fontSize: 17, letterSpacing: "-0.03em" }}>
            <span className="st-hide-m" style={{ color: "#6b7684", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 380 }}>
              Hakyeong Lee · {plainTitle(project.title)}
            </span>
            <span className="st-hide-m" style={{ color: "#d1d6db" }}>|</span>
            <button ref={labelRef} onClick={() => (menu ? setMenu(false) : openMenu())} style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 17, fontWeight: 700, color: menu ? "#6b7684" : BLUE, whiteSpace: "nowrap", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
              {String(s.chapter + 1).padStart(2, "0")}. {ch.group && ch.index > 0 ? ch.group : ch.title}
              <span style={{ display: "inline-block", fontSize: 12, transform: menu ? "rotate(180deg)" : "none", transition: "transform .25s" }}>⌄</span>
            </button>
          </div>
          <span />
        </div>
      </div>

      {/* 무대 — 좌표는 화면 기준. 문장은 화면 70% 높이, 이미지는 그 바로 위 */}
      <div style={{ position: "absolute", inset: 0, ["--text-top" as string]: "max(70vh, 360px)" }}>
        {p && prev !== null && layer(p, prev, `out-${prev}`, true, visualChanged, false)}
        {layer(s, i, `in-${s.isCover ? `c${i}` : s.visualKey}`, false, true, visualChanged)}
      </div>

      {/* 클릭 영역 */}
      <div className="pl-zone-l" onClick={() => go(i - 1)} style={{ position: "absolute", left: 0, top: 100, bottom: 110, width: "30%", zIndex: 5 }} />
      <div className="pl-zone-r" onClick={() => go(i + 1)} style={{ position: "absolute", right: 0, top: 100, bottom: 110, width: "70%", zIndex: 5 }} />

      {/* 하단 컨트롤 */}
      <div style={{ position: "absolute", left: "50%", bottom: 34, transform: "translateX(-50%)", display: "flex", gap: 12, zIndex: 10 }}>
        <button className="pl-ctl" onClick={() => go(i - 1)} disabled={i === 0} aria-label="이전">
          ‹
        </button>
        <button className="pl-ctl" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "일시정지" : "자동 재생"} style={{ fontSize: 13 }}>
          {playing ? "❚❚" : "▶"}
        </button>
        <button className="pl-ctl" onClick={() => go(i + 1)} disabled={i === scenes.length - 1} aria-label="다음">
          ›
        </button>
      </div>

      {menu && <ChapterOverlay chapters={chapters} current={s.chapter} anchorX={anchorX} onPick={(c) => { go(c.first); setMenu(false); }} onClose={() => setMenu(false)} />}

      {/* 시안 배지 */}
      <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 200, background: "#111", color: "#fff", borderRadius: 14, padding: "10px 14px", fontSize: 12, lineHeight: 1.6, maxWidth: 300, boxShadow: "0 8px 24px rgba(0,0,0,.18)" }}>
        <div style={{ fontWeight: 700 }}>상세 A · 토스 세션 모션 실측값</div>
        <div style={{ color: "#adb5bd", margin: "4px 0" }}>이미지 등장 (Admin 이미지마다 고를 값)</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {(["data", "auto", "settle", "unfold", "pop", "fade", "none"] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setForce(k);
                setReplay((r) => r + 1);
              }}
              style={{ border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, padding: "2px 8px", borderRadius: 99, background: force === k ? "#fff" : "rgba(255,255,255,.12)", color: force === k ? "#111" : "#fff" }}
            >
              {k === "data" ? "데이터대로" : MOTION_LABEL[k]}
            </button>
          ))}
        </div>
        <div style={{ color: "#8b95a1", marginTop: 6 }}>
          레퍼런스:{" "}
          <a href="https://toss.im/simplicity/sessions/how-to-measure-experience" target="_blank" rel="noopener noreferrer" style={{ color: "#9ec5ff" }}>
            how-to-measure-experience
          </a>
        </div>
      </div>
    </div>
  );
}
