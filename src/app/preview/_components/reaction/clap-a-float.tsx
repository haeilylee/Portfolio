"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@vercel/analytics";
import { useLimitedClap } from "./use-reactions";

/** 페이지 하단에 <div id="pv-log-slot" />를 두면 로그 패널이 거기로 들어간다 (플로팅 버튼과 분리) */
function useLogSlot() {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => { setSlot(document.getElementById("pv-log-slot")); }, []);
  return slot;
}

/**
 * Clap A — 플로팅 + 남은 횟수 점 5개 · 로그는 Vercel Analytics 이벤트.
 * 서버 DB에는 숫자만 쌓고, "누가 언제"는 이미 붙어 있는 Vercel Analytics의 custom event로 보낸다.
 * → 추가 인프라 0. Vercel 대시보드 Events 탭에서 slug별 박수 추이를 본다.
 */
export default function ClapAFloat({ slug }: { slug: string }) {
  const { clap, limit, used, remaining, total } = useLimitedClap(slug, "analytics");
  const [burst, setBurst] = useState<number | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const slot = useLogSlot();

  function onClap() {
    if (!clap()) return;
    const n = used + 1;
    setBurst(n);
    // Vercel Analytics custom event — 운영에서는 이 한 줄이 로그 전부
    track("clap", { slug, nth: n });
    setEvents((e) => [`track("clap", { slug: "${slug}", nth: ${n} })`, ...e].slice(0, 5));
  }

  const done = remaining <= 0;

  return (
    <>
      <div className="pv-clap-float">
        <div style={{ position: "relative" }}>
          {burst !== null && (
            <span key={burst} className="pv-clap-burst" onAnimationEnd={() => setBurst(null)}>+1</span>
          )}
          {/* 하루 5회를 다 쓰면 그냥 비활성 — 진척도는 노출하지 않는다 */}
          <button
            className="pv-clap-btn"
            data-clapped={used > 0}
            data-done={done}
            disabled={done}
            onClick={onClap}
            aria-label="박수"
            aria-disabled={done}
            title={done ? "오늘 박수를 다 보냈어요" : "박수 보내기"}
          >
            <span style={{ filter: used > 0 && !done ? "grayscale(1) brightness(10)" : "none" }}>👏</span>
          </button>
        </div>
        <div style={{ textAlign: "center", lineHeight: 1.2 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: done ? "#bbb" : "#111", letterSpacing: "-0.03em" }}>{total}</div>
        </div>
      </div>

      {/* 로그 방식 설명 + 실제로 나간 이벤트 — 페이지 하단 슬롯으로 */}
      {slot &&
        createPortal(
          <LogPanel
            title="로그 · Vercel Analytics 이벤트"
            desc="이미 설치된 @vercel/analytics의 track()으로 박수마다 이벤트를 쏴요. 별도 DB·대시보드 없이 Vercel → Analytics → Events에서 slug별 집계를 봐요. 개인 식별 정보는 보내지 않아요."
            pros="추가 인프라 없음 · 무료 티어로 충분 · 운영 코드 1줄"
            cons="개별 로그 조회는 Vercel 대시보드에서만 · 이벤트 속성은 숫자/짧은 문자열만"
            lines={events.length ? events : ["(박수를 누르면 여기에 이벤트가 찍혀요)"]}
          />,
          slot
        )}
    </>
  );
}

export function LogPanel({ title, desc, pros, cons, lines }: { title: string; desc: string; pros: string; cons: string; lines: string[] }) {
  return (
    <div className="pv-logpanel">
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", letterSpacing: "-0.03em", marginBottom: "6px" }}>{title}</div>
      <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.65, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{desc}</p>
      <div style={{ fontSize: "11px", color: "#168f52", marginBottom: "2px" }}>+ {pros}</div>
      <div style={{ fontSize: "11px", color: "#c76a12", marginBottom: "10px" }}>− {cons}</div>
      <pre className="pv-logpre">{lines.join("\n")}</pre>
    </div>
  );
}
