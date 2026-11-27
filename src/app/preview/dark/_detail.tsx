"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import type { Chapter, Scene } from "../_shared/story";
import { PD_META, plainTitle } from "../_shared/story";
import { ChapterBar, ChapterMenu, RichText, VisualView } from "../_shared/ui";
import { ACCENT, DARK, DarkBadge, DarkStyles } from "./_parts";

/**
 * 상세 — 토스 Simplicity 세션(the-last-design-tool)처럼 "같은 자리에서" 매끄럽게 넘어간다.
 * - 문장 위치는 화면 가운데 아래쪽에 고정, 비주얼은 그 바로 위에 붙는다(가운데 칼럼, 왼쪽 정렬)
 * - 비주얼이 같으면 문장만 바뀌고, 비주얼이 바뀔 때만 아래에서 살짝 떠오르며 교체
 * - 이전 장면은 짧게 위로 사라지고(180ms) 새 장면이 떠오른다(520ms)
 * 조작: 화면 오른쪽 클릭 = 다음 / 왼쪽 = 이전, ←→·스페이스, 트랙패드·휠, 하단 ‹ ❚❚ ›, 진행바·챕터 메뉴
 */
export default function DarkDetail({ project, scenes, chapters, variant }: { project: Project; scenes: Scene[]; chapters: Chapter[]; variant: "a" }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null); // 퇴장 중인 장면
  const [playing, setPlaying] = useState(false);
  const lock = useRef(0);
  const touch = useRef<number | null>(null);
  const meta = PD_META[project.slug];
  const accent = ACCENT[meta?.series ?? "AI Workflow"];

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
    const id = setTimeout(() => setPrev(null), 200);
    return () => clearTimeout(id);
  }, [prev, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 14 || Date.now() - lock.current < 480) return;
      lock.current = Date.now();
      go(iRef.current + (d > 0 ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [go]);

  // 자동 재생: 문장 길이에 맞춰 머문다
  useEffect(() => {
    if (!playing) return;
    if (i >= scenes.length - 1) return setPlaying(false);
    const id = setTimeout(() => go(i + 1), 1800 + scenes[i].text.length * 40);
    return () => clearTimeout(id);
  }, [playing, i, scenes, go]);

  const s = scenes[i];
  const p = prev !== null ? scenes[prev] : null;
  const visualChanged = !p || p.visualKey !== s.visualKey || p.isCover !== s.isCover;

  const layer = (sc: Scene, idx: number, layerKey: string, leaving: boolean, showVisual: boolean, animateVisual: boolean) => (
    <div
      key={layerKey}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        animation: leaving ? "dk-out .18s ease-in both" : undefined,
      }}
    >
      {sc.isCover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", textAlign: "center", padding: "0 24px", animation: leaving ? undefined : "dk-in .6s cubic-bezier(.2,.8,.2,1) both" }}>
          <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontStyle: "italic", fontSize: "clamp(48px, 7vw, 104px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: accent }}>{sc.group ?? "Overview"}</div>
          <h2 style={{ margin: "22px auto 0", maxWidth: 760, fontSize: "clamp(22px, 2.4vw, 32px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.4, wordBreak: "keep-all", color: "#fff" }}>{sc.text}</h2>
        </div>
      ) : (
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "min(820px, calc(100vw - 48px))", transform: "translateX(-50%)" }}>
          {/* 비주얼: 문장 바로 위에 붙는다 */}
          {showVisual && (
            <div
              key={`v-${sc.visualKey}`}
              style={{ position: "absolute", left: 0, right: 0, bottom: "44%", display: "flex", justifyContent: "flex-start", ["--st-img-h" as string]: "44vh", animation: animateVisual ? "dk-in .55s cubic-bezier(.2,.8,.2,1) both" : undefined }}
            >
              <VisualView visual={sc.visual} tint="#eef1f6" />
            </div>
          )}
          {/* 문장: 위치 고정 */}
          <p key={`t-${idx}`} style={{ position: "absolute", left: 0, right: 0, top: "calc(56% + 8px)", margin: 0, fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 700, lineHeight: 1.5, letterSpacing: "-0.035em", wordBreak: "keep-all", color: "#fff", animation: leaving ? undefined : "dk-in .45s .12s cubic-bezier(.2,.8,.2,1) both" }}>
            <RichText text={sc.text} accent={accent} animate={!leaving} />
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "radial-gradient(120% 60% at 50% 118%, #1a2340 0%, #0b0d14 45%, #000 75%)", color: "#fff", overflow: "hidden", zIndex: 30 }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <DarkStyles />
      <style>{`
        @keyframes dk-in { from { opacity: 0; transform: translateY(14px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes dk-out { to { opacity: 0; transform: translateY(-10px); filter: blur(3px); } }
        .dk-zone-l { cursor: w-resize; } .dk-zone-r { cursor: e-resize; }
        .dk-ctl { width: 44px; height: 44px; border-radius: 99px; border: none; background: #1b1c20; color: #fff; font-size: 16px; cursor: pointer; display:flex; align-items:center; justify-content:center; }
        .dk-ctl:hover { background: #26282e; }
        .dk-ctl:disabled { opacity: .3; cursor: default; }
        @media (prefers-reduced-motion: reduce) { [style*="dk-in"], [style*="dk-out"] { animation: none !important; } }
      `}</style>

      {/* 상단 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 24px 0" }}>
        <ChapterBar chapters={chapters} index={i} dark onPick={(c) => go(c.first)} />
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center", marginTop: 8 }}>
          <Link href={`${DARK}/${variant}`} aria-label="목록으로" className="dk-ctl" style={{ width: 40, height: 40, textDecoration: "none", fontSize: 18 }}>
            ‹
          </Link>
          <div style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
            <ChapterMenu title={plainTitle(project.title)} chapters={chapters} current={s.chapter} onPick={(c) => go(c.first)} />
          </div>
          <span style={{ fontSize: 12, color: "#6b7684", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {i + 1}/{scenes.length}
          </span>
        </div>
      </div>

      {/* 무대: 퇴장 레이어(비주얼이 바뀔 때만 비주얼 포함) + 등장 레이어 */}
      <div style={{ position: "absolute", inset: "96px 0 100px" }}>
        {/* 비주얼이 그대로면 등장 레이어를 다시 만들지 않아 비주얼은 가만히 있고, 문장만 key로 교체된다 */}
        {p && prev !== null && layer(p, prev, `out-${prev}`, true, visualChanged, false)}
        {layer(s, i, `in-${s.isCover ? `c${i}` : s.visualKey}`, false, true, visualChanged)}
      </div>

      {/* 클릭 영역: 왼쪽 30% 이전 / 오른쪽 70% 다음 */}
      <div className="dk-zone-l" onClick={() => go(i - 1)} style={{ position: "absolute", left: 0, top: 96, bottom: 100, width: "30%", zIndex: 5 }} />
      <div className="dk-zone-r" onClick={() => go(i + 1)} style={{ position: "absolute", right: 0, top: 96, bottom: 100, width: "70%", zIndex: 5 }} />

      {/* 하단 컨트롤 */}
      <div style={{ position: "absolute", left: "50%", bottom: 32, transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 10 }}>
        <button className="dk-ctl" onClick={() => go(i - 1)} disabled={i === 0} aria-label="이전">
          ‹
        </button>
        <button className="dk-ctl" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "일시정지" : "자동 재생"} style={{ fontSize: 12 }}>
          {playing ? "❚❚" : "▶"}
        </button>
        <button className="dk-ctl" onClick={() => go(i + 1)} disabled={i === scenes.length - 1} aria-label="다음">
          ›
        </button>
      </div>

      {i === 0 && (
        <div style={{ position: "absolute", right: 32, bottom: 44, zIndex: 6, fontSize: 13, color: "#8b95a1", animation: "dk-swap .5s .6s both" }}>
          화면을 누르거나 → 키로 넘겨요 <span style={{ color: accent }}>›</span>
        </div>
      )}

      <DarkBadge title="a 상세 · 같은 자리에서 매끄럽게 교체" extraRef={{ label: "세션 the-last-design-tool", href: "https://toss.im/simplicity/sessions/the-last-design-tool" }} />
    </div>
  );
}
