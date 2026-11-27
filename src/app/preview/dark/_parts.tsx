"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { PD_HERO, PD_META, PD_SERIES, plainTitle } from "../_shared/story";

/* toss.im/simplicity 를 그대로 따르는 다크 홈 */

export const DARK = "/preview/dark";
export const ACCENT: Record<string, string> = { "Product Design": "#64a8ff", "AI Workflow": "#c7a4ff" };
const REF = [{ label: "toss.im/simplicity (펼쳐보기·모아보기)", href: "https://toss.im/simplicity" }];

export type Card =
  | { kind: "project"; slug?: string; title: string; series: string; label: string; date?: string; img?: string; desc?: string; example?: boolean }
  | { kind: "series"; series: string; subtitle: string; count: number };

/** 시리즈 순서대로 정렬한 카드. 썸네일은 사용자가 다시 지정할 예정 — 지금은 기존 이미지로 자리만 채운다. */
export function toCards(projects: Project[], withSeriesCovers = false): Card[] {
  const out: Card[] = [];
  PD_SERIES.forEach((s) => {
    const items: Card[] = projects
      .filter((p) => PD_META[p.slug]?.series === s.title)
      .map((p) => ({ kind: "project", slug: p.slug, title: plainTitle(p.title), series: s.title, label: PD_META[p.slug]?.label ?? p.category, date: p.date, img: p.heroThumbnail ?? p.thumbnail, desc: p.outcomes[0] }));
    if (items.length === 0) items.push({ kind: "project", title: "고객 문제를 제품 경험으로", series: s.title, label: "준비 중", example: true, desc: "다음 이야기를 준비하고 있어요." });
    if (withSeriesCovers) out.push({ kind: "series", series: s.title, subtitle: s.subtitle, count: items.filter((c) => c.kind === "project" && !c.example).length });
    out.push(...items);
  });
  return out;
}

export function DarkStyles() {
  return (
    <style>{`
      .dk-tab { background:none; border:none; color:#6b7684; font-size:16px; font-weight:600; letter-spacing:-0.02em; cursor:pointer; font-family:inherit; padding: 6px 0; transition: color .2s; white-space: nowrap; }
      .dk-tab:hover, .dk-tab[data-on="1"] { color:#fff; }
      .dk-row { display:grid; grid-template-columns: 96px 1fr; gap: 24px; padding: 18px 0; text-decoration:none; color:#fff; }
      .dk-row:hover .dk-thumb { transform: scale(1.04); }
      .dk-thumb { transition: transform .3s; }
      @keyframes dk-row-in { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }
      @keyframes dk-swap { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:none; } }
      @media (max-width: 768px) { .dk-hide-m { display:none !important; } .dk-tabs { gap: 18px !important; overflow-x:auto; } }
    `}</style>
  );
}

/* ── 상단 바 ── */
export function TopBar({ center }: { center: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: 72, zIndex: 40, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 28px", background: "linear-gradient(#000 60%, transparent)" }}>
      <Link href={DARK} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", textDecoration: "none", fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/profile.webp" alt="" style={{ width: 30, height: 30, background: "#fff", borderRadius: 9, padding: 2 }} />
        <span className="dk-hide-m">Hakyeong Lee</span>
      </Link>
      <div style={{ minWidth: 0 }}>{center}</div>
      <div style={{ justifySelf: "end", position: "relative" }}>
        <button onClick={() => setMenu((v) => !v)} aria-label="메뉴" style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>
          ☰
        </button>
        {menu && (
          <div style={{ position: "absolute", right: 0, top: 44, width: 320, background: "#1b1c20", borderRadius: 18, padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,.5)", color: "#fff" }}>
            <div style={{ fontSize: 13, color: "#8b95a1", marginBottom: 6 }}>{PD_HERO.role}</div>
            <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.7, color: "#d1d6db", whiteSpace: "pre-line" }}>{PD_HERO.bio}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { href: PD_HERO.github, label: "GitHub" },
                { href: PD_HERO.linkedin, label: "LinkedIn" },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#fff", background: "#2a2c32", padding: "7px 14px", borderRadius: 99, textDecoration: "none" }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/** 가운데 시즌 라벨 (값이 바뀌면 살짝 올라오며 교체) */
export function SeasonLabel({ text }: { text: string }) {
  return (
    <div key={text} style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", whiteSpace: "nowrap", animation: "dk-swap .35s both" }}>
      {text}
    </div>
  );
}

/* ── 하단 펼쳐보기 / 모아보기 ── */
export function ModeToggle({ mode, onChange }: { mode: "spread" | "list"; onChange: (m: "spread" | "list") => void }) {
  const seg = (m: "spread" | "list", icon: string, label: string) => {
    const on = mode === m;
    return (
      <button
        onClick={() => onChange(m)}
        style={{ height: 44, padding: on ? "0 18px" : "0 12px", borderRadius: 99, border: "none", background: on ? "#2a2c32" : "transparent", color: on ? "#fff" : "#8b95a1", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, transition: "all .25s" }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        {on && label}
      </button>
    );
  };
  return (
    <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 40, display: "flex", gap: 2, padding: 4, borderRadius: 99, background: "rgba(20,21,24,.9)", backdropFilter: "blur(12px)" }}>
      {seg("spread", "❐", "펼쳐보기")}
      {seg("list", "☰", "모아보기")}
    </div>
  );
}

/* ── 펼쳐보기: 포스터 커버플로우 ── */
export function Coverflow({ cards, base, onCurrent }: { cards: Card[]; base: string; onCurrent?: (c: Card) => void }) {
  const router = useRouter();
  const firstProject = Math.max(0, cards.findIndex((c) => c.kind === "project" && !c.example && c.slug));
  const [cur, setCur] = useState(firstProject);
  const [open, setOpen] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const lock = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 120);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setCur((c) => Math.min(c, cards.length - 1));
  }, [cards.length]);
  useEffect(() => {
    if (cards[cur]) onCurrent?.(cards[cur]);
  }, [cur, cards, onCurrent]);

  const go = (d: number) => setCur((c) => Math.max(0, Math.min(cards.length - 1, c + d)));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Enter") enter(cur);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const enter = (i: number) => {
    if (i !== cur) return setCur(i);
    const c = cards[i];
    if (c.kind === "project" && c.slug) router.push(`${base}/${c.slug}`);
    if (c.kind === "series") go(1);
  };

  const W = 300;
  const GAP = 10;
  return (
    <div
      onWheel={(e) => {
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(d) < 18 || Date.now() - lock.current < 380) return;
        lock.current = Date.now();
        go(d > 0 ? 1 : -1);
      }}
      onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        if (Math.abs(dx) > 50) {
          go(dx < 0 ? 1 : -1);
          drag.current = { x: e.clientX, moved: true };
        }
      }}
      onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
      onPointerLeave={() => (drag.current = null)}
      style={{ position: "fixed", inset: 0, overflow: "hidden", touchAction: "pan-y", userSelect: "none" }}
    >
      {cards.map((c, i) => {
        const o = i - cur;
        const center = o === 0;
        const x = open ? o * (W + GAP) : o * 6;
        const h = center ? 560 : 480;
        return (
          <div
            key={i}
            onClick={() => !drag.current?.moved && enter(i)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: W,
              height: h,
              marginLeft: -W / 2,
              marginTop: -h / 2 + 10,
              transform: `translateX(${x}px) rotate(${open ? 0 : o * 4}deg) scale(${open ? 1 : 0.9})`,
              transition: `transform .6s cubic-bezier(.2,.9,.1,1) ${open ? Math.abs(o) * 40 : 0}ms, height .45s cubic-bezier(.2,.9,.1,1), margin .45s cubic-bezier(.2,.9,.1,1)`,
              zIndex: 20 - Math.abs(o),
              cursor: "pointer",
              overflow: "hidden",
              borderRadius: 4,
              background: "#16171b",
            }}
          >
            {c.kind === "series" ? <SeriesPoster c={c} center={center} /> : <ProjectPoster c={c} center={center} />}
            <div style={{ position: "absolute", inset: 0, background: "#000", opacity: center ? 0 : 0.55, transition: "opacity .45s", pointerEvents: "none" }} />
          </div>
        );
      })}
    </div>
  );
}

function ProjectPoster({ c, center }: { c: Extract<Card, { kind: "project" }>; center: boolean }) {
  return (
    <>
      {c.img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.img} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#eef1f6" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #2a2d36, #121317)" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,.75) 62%, #000 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 20px 26px", textAlign: "center", color: "#fff" }}>
        {/* 내 캐릭터 — 가운데 카드에서만 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.webp"
          alt=""
          draggable={false}
          style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", padding: 3, display: "block", margin: "0 auto 12px", opacity: center ? 1 : 0, transform: center ? "none" : "translateY(10px) scale(.8)", transition: "all .4s .1s" }}
        />
        {c.example && <div style={{ display: "inline-block", fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,.16)", marginBottom: 8 }}>예시</div>}
        <div style={{ fontSize: center ? 26 : 22, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.28, wordBreak: "keep-all", transition: "font-size .4s" }}>{c.title}</div>
        <div style={{ fontSize: 13, color: "#b0b8c1", marginTop: 10 }}>
          <span style={{ color: ACCENT[c.series] }}>{c.series}</span> · {c.label}
        </div>
        <div style={{ fontSize: 13, color: "#8b95a1", lineHeight: 1.6, marginTop: 10, maxHeight: center ? 80 : 0, opacity: center ? 1 : 0, overflow: "hidden", transition: "all .4s .1s", wordBreak: "keep-all" }}>{c.desc}</div>
      </div>
    </>
  );
}

function SeriesPoster({ c, center }: { c: Extract<Card, { kind: "series" }>; center: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 70% at 50% 0%, ${ACCENT[c.series]}55, #0d0e11 70%)`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 26, color: "#fff" }}>
      <div style={{ fontSize: 13, color: ACCENT[c.series], fontWeight: 700, marginBottom: 10 }}>Series · {c.count}</div>
      <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontStyle: "italic", fontSize: center ? 44 : 36, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, transition: "font-size .4s" }}>{c.series}</div>
      <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.6, color: "#b0b8c1", wordBreak: "keep-all" }}>{c.subtitle}</p>
    </div>
  );
}

/* ── 모아보기: 탭 + 목록 ── */
export function ListView({ cards, base, tab }: { cards: Card[]; base: string; tab: string }) {
  const rows = cards.filter((c): c is Extract<Card, { kind: "project" }> => c.kind === "project" && (tab === "전체" || c.series === tab));
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 140px" }}>
      {rows.map((c, i) => {
        const inner = (
          <>
            <div style={{ width: 96, height: 150, borderRadius: 10, overflow: "hidden", background: "#1b1c20" }}>
              {c.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="dk-thumb" src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", background: "#eef1f6" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #2a2d36, #121317)" }} />
              )}
            </div>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT[c.series], marginBottom: 6 }}>
                {c.series} {c.example && <span style={{ color: "#6b7684", fontWeight: 500 }}>· 예시</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.035em", marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 14, color: "#6b7684", marginBottom: 12 }}>
                {c.label}
                {c.date ? ` · ${c.date}` : ""}
              </div>
              <div style={{ fontSize: 15, color: "#d1d6db", lineHeight: 1.65, wordBreak: "keep-all" }}>{c.desc}</div>
            </div>
          </>
        );
        const style: React.CSSProperties = { animation: `dk-row-in .45s ${i * 60}ms both` };
        return c.slug ? (
          <Link key={c.slug} href={`${base}/${c.slug}`} className="dk-row" style={style}>
            {inner}
          </Link>
        ) : (
          <div key={i} className="dk-row" style={{ ...style, opacity: 0.6 }}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function Tabs({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <div className="dk-tabs" style={{ display: "flex", gap: 32, justifyContent: "center" }}>
      {["전체", ...PD_SERIES.map((s) => s.title)].map((t) => (
        <button key={t} className="dk-tab" data-on={t === tab ? "1" : "0"} onClick={() => setTab(t)}>
          {t}
        </button>
      ))}
    </div>
  );
}

/** 시안 표시 배지 (a안만 남김) */
export function DarkBadge({ title, extraRef }: { current?: string; title: string; extraRef?: { label: string; href: string } }) {
  const refs = extraRef ? [...REF, extraRef] : REF;
  return (
    <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 200, background: "#fff", color: "#111", borderRadius: 14, padding: "10px 14px", fontSize: 12, lineHeight: 1.6, maxWidth: 340, boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}>
      <div style={{ fontWeight: 700 }}>시안 {title}</div>
      <div style={{ color: "#8b95a1" }}>
        레퍼런스:{" "}
        {refs.map((r, i) => (
          <span key={i}>
            {i > 0 && " · "}
            <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ color: "#3182f6" }}>
              {r.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
