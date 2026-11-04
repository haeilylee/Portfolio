"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * 상세 왼쪽 목차 — 2단 구조
 *  - 상위 분류(group): Helvetica 검정 이탤릭 (Background / Problem / Solution / Outcome)
 *  - 세부 분류(subgroup): 연회색 채움 배지 (예: Workflow). 읽는 구간이면 한 톤 진해진다
 *  - 항목: 상위 분류 아래 한 단계, 세부 분류 아래 두 단계 들여쓰기
 * 클릭하면 섹션 제목이 상단 내비게이션 바로 아래(본문 최상단)에 오도록 스크롤한다.
 */
export type TocItem = { id: string; label: string; group?: string; subgroup?: string };

/** 섹션 제목이 멈출 위치: 내비게이션 높이 + 여백 */
const ANCHOR_GAP = 32;

function navHeight() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  return parseFloat(v) || 56;
}

type Run = { sub?: string; items: TocItem[] };
type Group = { name?: string; runs: Run[] };

function structure(items: TocItem[]): Group[] {
  const groups: Group[] = [];
  for (const it of items) {
    let g = groups[groups.length - 1];
    if (!g || g.name !== it.group) { g = { name: it.group, runs: [] }; groups.push(g); }
    const r = g.runs[g.runs.length - 1];
    if (r && r.sub === it.subgroup) r.items.push(it);
    else g.runs.push({ sub: it.subgroup, items: [it] });
  }
  return groups;
}

export default function TocNav({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  /** 클릭으로 스크롤하는 동안에는 스크롤 위치로 active를 덮어쓰지 않는다 */
  const lockUntil = useRef(0);

  // 현재 위치: 제목이 앵커 위치를 지난 마지막 섹션
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (Date.now() < lockUntil.current) return;
      const line = navHeight() + ANCHOR_GAP + 8;
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        if (id === "overview") continue;
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  const scrollTo = useCallback((id: string) => {
    setActive(id);
    lockUntil.current = Date.now() + 900;
    if (id === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight() - ANCHOR_GAP;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    history.replaceState(null, "", `#${encodeURIComponent(id)}`);
  }, []);

  const Item = ({ it, indent = 0 }: { it: TocItem; indent?: number }) => {
    const on = active === it.id;
    return (
      <button
        onClick={() => scrollTo(it.id)}
        style={{ all: "unset", display: "block", padding: "6px 10px", marginLeft: indent, cursor: "pointer", textAlign: "left", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
      >
        <span style={{ fontSize: "var(--toc-item-size)", letterSpacing: "-0.02em", lineHeight: 1.45, color: on ? "#111" : "var(--toc-item-color)", fontWeight: on ? 600 : 400, transition: "color 0.15s", wordBreak: "keep-all", display: "block" }}>
          {it.label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="toc-nav"
      style={{
        width: "var(--toc-w)",
        position: "fixed",
        top: "calc(var(--nav-h) + 48px)",
        left: "var(--toc-left)",
        zIndex: 2,
        padding: "16px 8px 4px",
        maxHeight: "calc(100vh - var(--nav-h) - 48px - 32px)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div style={{ fontSize: "var(--toc-title-size)", color: "var(--toc-title-color)", fontWeight: 700, marginBottom: "10px", paddingLeft: "10px", flexShrink: 0 }}>
        목차
      </div>

      <nav className="toc-nav-scroll" style={{ display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto", paddingBottom: "24px", minHeight: 0 }}>
        {structure(items).map((g, gi) =>
          !g.name ? (
            <React.Fragment key={`top-${gi}`}>
              {g.runs.flatMap((r) => r.items).map((it) => <Item key={it.id} it={it} />)}
            </React.Fragment>
          ) : (
            <div key={`group-${gi}`} style={{ marginTop: "10px" }}>
              <div className="toc-group">{g.name}</div>
              {g.runs.map((r, ri) =>
                r.sub ? (
                  <div key={ri} style={{ marginTop: "4px" }}>
                    <div style={{ padding: "4px 10px 2px", marginLeft: "10px" }}>
                      <span className="toc-sub" data-reading={r.items.some((it) => it.id === active)}>{r.sub}</span>
                    </div>
                    {r.items.map((it) => <Item key={it.id} it={it} indent={20} />)}
                  </div>
                ) : (
                  <React.Fragment key={ri}>{r.items.map((it) => <Item key={it.id} it={it} indent={10} />)}</React.Fragment>
                ),
              )}
            </div>
          ),
        )}
      </nav>
    </div>
  );
}
