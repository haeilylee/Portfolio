"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Chapter, Scene, Visual } from "./story";

export const BLUE = "#3182f6";

/* ── 공통 키프레임 ── */
export function StoryStyles() {
  return (
    <style>{`
      @keyframes st-tilt-in { from { opacity:0; transform: perspective(1200px) rotateY(-18deg) rotateZ(-4deg) scale(.86) translateY(24px); filter: blur(8px); } to { opacity:1; transform:none; filter:none; } }
      @keyframes st-fade-up { from { opacity:0; transform: translateY(10px); filter: blur(4px); } to { opacity:1; transform:none; filter:none; } }
      @keyframes st-pop { 0% { opacity:0; transform: scale(.7) rotate(-6deg); } 60% { opacity:1; transform: scale(1.04) rotate(1deg); } 100% { transform:none; } }
      .st-word { display:inline-block; opacity:0; animation: st-fade-up .5s cubic-bezier(.2,.7,.2,1) forwards; white-space: pre; }
      .st-btn { width:44px; height:44px; border-radius:999px; border:none; background:#fff; box-shadow: 0 2px 10px rgba(0,0,0,.08); display:inline-flex; align-items:center; justify-content:center; cursor:pointer; color:#333; font-size:16px; }
      .st-btn:hover { background:#f6f6f6; }
      .st-btn:disabled { opacity:.35; cursor:default; }
      @media (prefers-reduced-motion: reduce) { .st-word { animation:none; opacity:1; } [data-st-anim] { animation:none !important; } }
    `}</style>
  );
}

/* ── **굵게** → 파란 강조 ── */
export function RichText({ text, animate = true, accent = BLUE }: { text: string; animate?: boolean; accent?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  let w = 0;
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.startsWith("**");
        const body = bold ? part.slice(2, -2) : part;
        const tokens = body.split(/(\s+)/);
        return (
          <span key={i} style={bold ? { color: accent } : undefined}>
            {tokens.map((tk, j) =>
              /^\s+$/.test(tk) || !animate ? (
                <span key={j}>{tk}</span>
              ) : (
                <span key={j} className="st-word" style={{ animationDelay: `${w++ * 28}ms` }}>
                  {tk}
                </span>
              )
            )}
          </span>
        );
      })}
    </>
  );
}

/* ── 비주얼 카드 ── */
export function VisualView({ visual, tint = "#f2f4f6" }: { visual: Visual; tint?: string }) {
  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 18px 50px rgba(30, 40, 80, .12)",
    overflow: "hidden",
    maxWidth: "100%",
    maxHeight: "100%",
  };
  switch (visual.kind) {
    case "image":
    case "cover":
      return visual.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={visual.src} alt="" style={{ ...card, display: "block", objectFit: "contain", width: "auto", height: "auto", background: tint, maxHeight: "var(--st-img-h, 50vh)", maxWidth: "min(880px, 100%)" }} />
      ) : (
        <div style={{ ...card, width: 320, height: 220, background: tint }} />
      );
    case "list":
      return (
        <div style={{ ...card, padding: "28px 28px 20px", width: 520 }}>
          {visual.items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderTop: i ? "1px solid #f0f0f0" : "none", animation: `st-fade-up .5s ${i * 120}ms both` }} data-st-anim>
              <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 99, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: "#444", letterSpacing: "-0.02em" }}>
                {it.title && <strong style={{ color: "#111", marginRight: 6 }}>{it.title}</strong>}
                {it.content}
              </div>
            </div>
          ))}
        </div>
      );
    case "card":
      return (
        <div style={{ ...card, padding: 32, width: 520 }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: BLUE, background: "#e8f3ff", padding: "4px 10px", borderRadius: 99, marginBottom: 14 }}>{visual.label}</div>
          <div style={{ fontSize: 16, lineHeight: 1.75, color: "#333", letterSpacing: "-0.02em", whiteSpace: "pre-line" }}>
            <RichText text={visual.content} animate={false} />
          </div>
        </div>
      );
    case "code":
      return (
        <div style={{ ...card, background: "#191f28", width: 560 }}>
          {visual.filename && <div style={{ padding: "12px 18px", fontSize: 12, color: "#8b95a1", borderBottom: "1px solid #2a323d" }}>{visual.filename}</div>}
          <pre style={{ margin: 0, padding: 20, fontSize: 12.5, lineHeight: 1.6, color: "#e5e8eb", overflow: "hidden", maxHeight: 360 }}>{visual.code}</pre>
        </div>
      );
    case "table":
      return (
        <div style={{ ...card, width: 560, padding: "8px 24px" }}>
          {visual.rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, padding: "12px 0", borderTop: i ? "1px solid #f0f0f0" : "none", fontSize: 14, lineHeight: 1.6 }}>
              <strong style={{ color: "#111" }}>{r.term}</strong>
              <span style={{ color: "#555" }}>{r.desc}</span>
            </div>
          ))}
        </div>
      );
  }
}

/** visualKey가 바뀔 때만 기울어진 카드가 들어오는 전환 (토스 세션의 이미지 전환) */
export function StageVisual({ scene, tint, style }: { scene: Scene; tint?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <div key={scene.visualKey} data-st-anim style={{ animation: "st-tilt-in .7s cubic-bezier(.2,.8,.2,1) both", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "100%", maxHeight: "100%" }}>
        <VisualView visual={scene.visual} tint={tint} />
      </div>
    </div>
  );
}

/* ── 챕터 진행바 (토스 세션 상단 세그먼트) ── */
export function ChapterBar({ chapters, index, dark = false, onPick }: { chapters: Chapter[]; index: number; dark?: boolean; onPick?: (c: Chapter) => void }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {chapters.map((c) => {
        const fill = index >= c.first + c.count ? 1 : index < c.first ? 0 : (index - c.first + 1) / c.count;
        return (
          <div
            key={c.index}
            onClick={onPick ? () => onPick(c) : undefined}
            title={onPick ? c.title : undefined}
            style={{ flex: Math.max(1, c.count), padding: onPick ? "6px 0" : 0, cursor: onPick ? "pointer" : "default" }}
          >
            <div style={{ height: 3, borderRadius: 2, background: dark ? "rgba(255,255,255,.18)" : "#e5e8eb", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill * 100}%`, background: dark ? "#fff" : "#4e5968", transition: "width .4s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── 챕터 드롭다운 ── */
export function ChapterMenu({ title, chapters, current, onPick }: { title: string; chapters: Chapter[]; current: number; onPick: (c: Chapter) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const ch = chapters[current];
  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, fontSize: 15, letterSpacing: "-0.03em", minWidth: 0 }}>
      {title && (
        <>
          <span className="st-hide-m" style={{ color: "#6b7684", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 320 }}>{title}</span>
          <span className="st-hide-m" style={{ color: "#d1d6db" }}>|</span>
        </>
      )}
      <button onClick={() => setOpen((v) => !v)} style={{ border: "none", background: "none", color: BLUE, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 360 }}>
        {String(current + 1).padStart(2, "0")}. {ch?.title} ▾
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,.14)", padding: 8, width: 360, zIndex: 10, maxHeight: "60vh", overflowY: "auto" }}>
          {chapters.map((c) => (
            <button
              key={c.index}
              onClick={() => {
                onPick(c);
                setOpen(false);
              }}
              style={{ display: "flex", gap: 10, width: "100%", textAlign: "left", border: "none", background: c.index === current ? "#f2f4f6" : "none", borderRadius: 10, padding: "10px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#333", letterSpacing: "-0.02em" }}
            >
              <span style={{ color: "#adb5bd", fontVariantNumeric: "tabular-nums" }}>{String(c.index + 1).padStart(2, "0")}</span>
              <span>
                {c.group && <span style={{ display: "block", fontSize: 11, color: "#8b95a1", fontStyle: "italic" }}>{c.group}</span>}
                {c.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 시안 배지 ── */
export function PreviewBadge({ current, title, refs, dark, base = "/preview/story" }: { current: "a" | "b" | "c"; title: string; refs: { label: string; href: string }[]; dark?: boolean; base?: string }) {
  return (
    <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 200, background: dark ? "#fff" : "#111", color: dark ? "#111" : "#fff", borderRadius: 14, padding: "12px 14px", fontSize: 12, lineHeight: 1.6, letterSpacing: "-0.02em", maxWidth: 340, boxShadow: "0 8px 24px rgba(0,0,0,.18)" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {(["a", "b", "c"] as const).map((k) => (
          <Link key={k} href={`${base}/${k}`} style={{ padding: "2px 10px", borderRadius: 999, background: k === current ? BLUE : dark ? "#f2f4f6" : "rgba(255,255,255,.14)", color: k === current ? "#fff" : "inherit", textDecoration: "none", fontWeight: 700 }}>
            {k.toUpperCase()}
          </Link>
        ))}
      </div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ color: "#8b95a1" }}>
        레퍼런스:{" "}
        {refs.map((r, i) => (
          <span key={i}>
            {i > 0 && " · "}
            <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ color: dark ? BLUE : "#9ec5ff" }}>
              {r.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}

export const REF_HOME = { label: "toss.im/simplicity", href: "https://toss.im/simplicity" };
export const REF_SESSION = { label: "Simplicity 세션 상세", href: "https://toss.im/simplicity/sessions/legal-meets-perfect-ux" };
