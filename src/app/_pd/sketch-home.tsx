"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { hero } from "@/lib/projects";
import { PD_META, PD_SERIES, plainTitle } from "./story";
import { StoryStyles } from "./ui";

/**
 * 홈 — 사용자 스케치(1·2·3) 기준 + 토스 Simplicity에서 가져온 인터랙션.
 * 1) 캐릭터만 가운데  →  2) 캐릭터가 위로, 소개가 단어별로 떠오르고 목록이 아래에서 올라옴(자동)
 * 3) 스크롤하면 소개는 흐려지며 올라가고, 캐릭터는 상단에 붙음. 목록 행은 화면에 들어올 때 떠오른다.
 * 모션 어휘: 흐림+14px 상승 fade-in, cubic-bezier(.2,.8,.2,1) — 세션 상세와 같은 값.
 */
const EASE = "cubic-bezier(.2,.8,.2,1)";

type Row = { slug?: string; series: string; label: string; title: string; period: string; desc: string; img?: string; example?: boolean };

/** "2026/02 → 03" → "2026.02-03 (1 month)" */
function period(date: string) {
  const m = date.match(/(\d{4})\/(\d{2})\s*→\s*(?:(\d{4})\/)?(\d{2})/);
  if (!m) return date;
  const [, y, a, y2, b] = m;
  const months = Math.max(1, (Number(y2 ?? y) - Number(y)) * 12 + Number(b) - Number(a));
  return `${y}.${a}-${b} (${months} month${months > 1 ? "s" : ""})`;
}

function toGroups(projects: Project[]) {
  return PD_SERIES.map((s) => {
    const rows: Row[] = projects
      .filter((p) => PD_META[p.slug]?.series === s.title)
      .map((p) => ({ slug: p.slug, series: s.title, label: PD_META[p.slug]?.label ?? p.category, title: plainTitle(p.title), period: period(p.date), desc: p.outcomes[0] ?? "", img: p.thumbnail }));
    if (rows.length === 0) rows.push({ series: s.title, label: "준비 중", title: "다음 이야기를 준비하고 있어요", period: "", desc: s.subtitle, example: true });
    return { series: s.title, rows };
  });
}

export default function SketchHome({ projects }: { projects: Project[] }) {
  const [intro, setIntro] = useState(0); // 0: 캐릭터만, 1: 소개·목록 등장
  const [y, setY] = useState(0); // 실제 스크롤 (흐름 안의 목록용)
  const [sy, setSy] = useState(0); // 부드럽게 따라가는 스크롤 (고정 요소용)
  const [introDone, setIntroDone] = useState(false);
  const groups = toGroups(projects);
  // 소개는 content.json(Admin 입력값). 문단은 빈 줄, 문단 안 줄바꿈은 줄바꿈으로 구분한다.
  // 첫 문단은 등장할 때 자동으로, 두 번째 문단은 스크롤에 맞춰 글자별로 채워진다.
  const paras = hero.bio.includes("\n\n") ? hero.bio.split(/\n\s*\n/) : hero.bio.split("\n");
  const withBreaks = (p = "") => p.trim().split("\n").flatMap((l, i) => (i ? ["\n", l.trim()] : [l.trim()]));
  const leadParts = withBreaks(paras[0]);
  const restParts = withBreaks(paras.slice(1).join("\n"));
  const [introFill, setIntroFill] = useState(0);
  useEffect(() => {
    if (!intro) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setIntroFill(1);
    let raf = 0;
    const start = performance.now() + 900; // 캐릭터가 자리 잡고 글이 떠오른 뒤
    const DUR = 1700;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / DUR));
      setIntroFill(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // easeInOutQuad
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intro]);

  // 1 → 2 자동 재생 (스크롤하면 바로 넘어감)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setIntro(1), reduce ? 0 : 900);
    const t2 = setTimeout(() => setIntroDone(true), reduce ? 0 : 2300);
    // 고정 요소(캐릭터·소개)는 스크롤 값을 부드럽게 따라가게(관성) — 위로 올라갈 때 툭툭 끊기지 않도록
    let raf = 0;
    let cur = window.scrollY;
    const tick = () => {
      const target = window.scrollY;
      cur = target; // 관성 없음 — 고정 요소가 목록과 한 몸처럼 1:1로 움직인다
      if (Math.abs(target - cur) < 0.5) cur = target;
      setSy(cur);
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };
    const on = () => {
      setY(window.scrollY);
      if (window.scrollY > 4) {
        setIntro(1);
        setIntroDone(true);
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 2 → 3: 스크롤 진행도
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  // ① 0~360 단어 채움(크기 그대로) → ② 360~580 다 채운 채로 머묾(읽는 시간)
  // → ③ 540~760 글자·캐릭터가 작아지며 위로 → ④ 740~920 블러로 사라짐
  // 시작과 끝이 모두 부드러운 easeInOut (smootherstep)
  const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  // 한 번 다 읽은 문장은 위로 올라가도 다시 흐려지지 않는다
  const filled = useRef(0);
  /* ── 키감 (단위 px, 스크롤 위치 기준) ─────────────────────────
   *   0 ─ 260  READ    : 캐릭터·소개 제자리. 두 번째 문단이 글자별로 진해진다
   * 280 ─      RELEASE : 캐릭터와 소개가 한 덩어리로 스크롤과 1:1로 올라가며 작아진다
   *                      캐릭터는 34px 올라가 상단에 도킹(이후 고정), 280→420 동안 100→44px
   * 300 ─ 390  EXIT    : 소개는 캐릭터 밑으로 들어가기 전에 블러+페이드아웃
   * 목록은 READ 동안만 천천히(38%→100%) 따라오고, RELEASE부터는 페이지와 똑같이 움직인다 */
  const READ = 260;
  const REL = 280;
  filled.current = Math.max(filled.current, clamp(sy / READ));
  const fill = filled.current;
  const lift = Math.max(0, sy - REL); // RELEASE 이후 1:1로 올라감
  const s = ease(clamp(lift / 140)); // 줄어듦
  const out = ease(clamp((sy - 300) / 90)); // 사라짐
  const k = ease(clamp((sy - 290) / 100)); // 상단 흰 그라데이션
  const listShift = 0.62 * (y < REL ? y - (y * y) / (2 * REL) : REL / 2);
  const avatarTop = intro ? Math.max(66, 100 - lift) : null; // px. null이면 화면 가운데

  // 첫 화면에서 스크롤을 막아 1→2 연출이 끝난 뒤 내려가게
  useEffect(() => {
    document.documentElement.style.overflow = intro ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [intro]);

  return (
    <div style={{ minHeight: "100vh", color: "#111", position: "relative" }}>
      {/* 배경: 화면에 고정된 한 장 — 콘텐츠 길이와 상관없이 끊기지 않는다 */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, background: "linear-gradient(#fff 0%, #fff 55%, #f6f7f9 100%)" }} />
      <StoryStyles />
      <style>{`
        @keyframes sk-in { from { opacity:0; transform: translateY(14px); filter: blur(4px); } to { opacity:1; transform:none; filter:none; } }
        @keyframes sk-pop { from { opacity:0; transform: scale(.86); filter: blur(6px); } to { opacity:1; transform:none; filter:none; } }
        .sk-row { display:grid; grid-template-columns: 237px 1fr; column-gap: 25px; text-decoration:none; color: inherit; }
        .sk-item { display:grid; grid-template-columns: 121px 1fr; column-gap: 26px; padding: 32px 0 32px 35px; border-bottom: 1px solid #f0f0f0; }
        .sk-thumb { width:121px; height:140px; border-radius:4px; overflow:hidden; background:#f2f3f5; transition: transform .35s ${EASE}, box-shadow .35s; }
        a.sk-row:hover .sk-thumb { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,.12); }
        a.sk-row:hover .sk-title { color: #3182f6; }
        .sk-title { transition: color .2s; }
        @media (max-width: 860px) {
          .sk-row { grid-template-columns: 1fr; }
          .sk-label { text-align:left !important; padding: 24px 0 0 !important; }
          .sk-item { padding-left: 0; grid-template-columns: 96px 1fr; column-gap: 18px; }
          .sk-thumb { width:96px; height:112px; }
        }
      `}</style>

      {/* 상단 고정: 이름 + 캐릭터 */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 140, zIndex: 20, pointerEvents: "none", background: `linear-gradient(#fff 70%, rgba(255,255,255,0))`, opacity: k, transition: "opacity .2s" }} />
      <div style={{ position: "fixed", top: 36, left: 0, right: 0, textAlign: "center", zIndex: 30, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 14, letterSpacing: "-0.01em", animation: `sk-in .6s ${EASE} both` }}>
        Product Designer • Hakyeong Lee
      </div>
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="맨 위로"
        style={{
          position: "fixed",
          left: "50%",
          top: avatarTop === null ? "50%" : avatarTop,
          zIndex: 31,
          width: 100,
          height: 100,
          marginLeft: -50,
          marginTop: avatarTop === null ? -50 : 0,
          transform: `scale(${1 - 0.56 * s})`,
          transformOrigin: "50% 0",
          transition: !introDone ? `top .9s ${EASE}, margin .9s ${EASE}` : "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/profile.webp" alt="Hakyeong Lee" style={{ width: "100%", height: "100%", display: "block", animation: `sk-pop .7s .15s ${EASE} both` }} />
      </Link>

      {/* 소개 (2단계) — 화면에 고정된 채 스크롤에 따라 단어별로 진해지고, 글자가 작아지며 올라간다 */}
      {intro ? (
        <section
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 236 - lift,
            zIndex: 10,
            textAlign: "center",
            padding: "0 24px",
            transform: `scale(${1 - 0.16 * s})`,
            transformOrigin: "50% 0",
            opacity: 1 - out,
            filter: `blur(${out * 8}px)`,
            pointerEvents: "none",
          }}
        >
          <div style={{ animation: `sk-in .7s .5s ${EASE} both` }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 600, lineHeight: 1.45, letterSpacing: "-0.03em", wordBreak: "keep-all" }}>
              <CharFill parts={leadParts} progress={introFill} dim={[217, 217, 217]} ink={[25, 25, 25]} />
            </p>
            <p style={{ margin: "26px auto 0", fontSize: 22, fontWeight: 500, lineHeight: 1.45, letterSpacing: "-0.03em", wordBreak: "keep-all" }}>
              <CharFill parts={restParts} progress={fill} dim={[235, 235, 235]} ink={[110, 110, 110]} />
            </p>
          </div>
        </section>
      ) : null}
      {/* 스크롤 안내 */}
      {intro ? (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 28, textAlign: "center", fontSize: 12, color: "#b0b0b0", zIndex: 10, opacity: 1 - clamp(y / 40), fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          <span style={{ display: "inline-block", animation: `sk-in .6s 1s ${EASE} both` }}>Scroll ↓</span>
        </div>
      ) : null}
      {/* 목록 첫 줄이 처음부터 화면 아래에 살짝 보이고, 스크롤하자마자 따라 올라온다 */}
      <div style={{ height: "calc(100vh - 64px)" }} />

      {/* 목록 (2단계에서 아래에서 올라옴, 3단계에서 행마다 떠오름) */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 55vh", opacity: intro ? 1 : 0, transform: `translateY(${(intro ? 0 : 40) + listShift}px)`, transition: !introDone ? `opacity .8s .55s ${EASE}, transform .8s .55s ${EASE}` : "none" }}>
        {groups.map((g) =>
          g.rows.map((r, i) => <RowView key={g.series + i} r={r} label={i === 0 ? g.series : ""} />)
        )}
      </div>
    </div>
  );
}

/**
 * 글자별 채움 — 토스 Simplicity 세션 문장처럼 채워지는 경계가 몇 글자에 걸쳐 부드럽게 번진다.
 * progress 0→1 에 따라 앞 글자부터 dim → ink 로.
 */
function CharFill({ parts, progress, dim, ink, soft = 7 }: { parts: string[]; progress: number; dim: number[]; ink: number[]; soft?: number }) {
  const chars = parts.join("").split("");
  const N = chars.filter((c) => c !== "\n").length;
  const front = progress * (N + soft); // 채움 경계(글자 단위)
  let n = 0;
  return (
    <>
      {chars.map((c, i) => {
        if (c === "\n") return <br key={i} />;
        const t = Math.min(1, Math.max(0, (front - n++) / soft));
        const col = dim.map((d, j) => Math.round(d + (ink[j] - d) * t));
        return (
          <span key={i} style={{ color: `rgb(${col.join(",")})` }}>
            {c}
          </span>
        );
      })}
    </>
  );
}

/** 목록 한 줄 — 화면에 들어올 때 흐림+상승으로 떠오른다. 들어오기 전엔 흐리게 보인다(스케치 3의 아래 행). */
function RowView({ r, label }: { r: Row; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin: "0px 0px -18% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const body = (
    <>
      <div className="sk-label" style={{ textAlign: "right", paddingTop: 45, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontStyle: "italic", fontSize: 14, color: "#9a9a9a" }}>
        {label}
      </div>
      <div className="sk-item">
        <div className="sk-thumb">
          {r.img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )}
        </div>
        <div style={{ paddingTop: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#777", marginBottom: 6 }}>
            {r.series}
            {r.example && <span style={{ fontWeight: 400, color: "#aaa" }}> · 예시</span>}
          </div>
          <div className="sk-title" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
            {r.title}
          </div>
          {r.period && <div style={{ fontSize: 14, color: "#aaa", marginBottom: 16 }}>{r.period}</div>}
          <div style={{ fontSize: 13.5, lineHeight: 1.45, color: "#666", maxWidth: 560, wordBreak: "keep-all" }}>{r.desc}</div>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={ref}
      style={{
        opacity: on ? 1 : 0.2,
        transform: on ? "none" : "translateY(14px)",
        filter: on ? "none" : "blur(2px)",
        transition: `opacity .7s ${EASE}, transform .7s ${EASE}, filter .7s ${EASE}`,
      }}
    >
      {r.slug ? (
        <Link href={`/projects/${r.slug}`} className="sk-row">
          {body}
        </Link>
      ) : (
        <div className="sk-row">{body}</div>
      )}
    </div>
  );
}
