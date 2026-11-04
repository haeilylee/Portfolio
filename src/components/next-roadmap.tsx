"use client";

import { useState } from "react";
import Link from "next/link";
import type { Section } from "@/lib/projects";

/**
 * 상세 본문 끝 '다음 이야기' — 시리즈 로드맵.
 *  01 지금 읽은 글(검정) → 02~ 다음 이야기
 *  - 연결된 공개 프로젝트가 없으면 '작업 중': 흑백 · 점선 · 링크 없음 · 첫 단락만 보이고 나머지는 펼치기
 *  - 연결되면(nextSlug) 색을 돌려주고 해당 프로젝트로 이동
 * 본문 흐름과 목차(TOC)에서는 빠진다.
 */
export interface NextItem {
  section: Section;
  /** 연결된 공개 프로젝트 (없으면 작업 중) */
  linked?: { slug: string; title: string };
}

function paragraphs(section: Section) {
  return section.blocks
    .map((b) => ("content" in b && typeof b.content === "string" ? b.content : ""))
    .join("\n\n")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\*\*/g, "").trim())
    .filter(Boolean);
}

function WipBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "#777", background: "#ececec", borderRadius: "999px", padding: "3px 9px", letterSpacing: "-0.01em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#aaa" }} />
      작업 중
    </span>
  );
}

function Step({ index, item }: { index: number; item: NextItem }) {
  const [open, setOpen] = useState(false);
  const ps = paragraphs(item.section);
  const live = !!item.linked;
  const num = String(index).padStart(2, "0");

  return (
    <li className="roadmap-item" style={live ? undefined : { filter: "grayscale(1)" }}>
      <span className="roadmap-dot" data-live={live}>{num}</span>
      <div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: live ? "#111" : "#aaa" }}>다음 이야기</span>
          {!live && <WipBadge />}
        </div>
        {live ? (
          <Link href={`/projects/${item.linked!.slug}`} className="roadmap-title" style={{ color: "#111" }}>
            {item.section.title} →
          </Link>
        ) : (
          <div className="roadmap-title" style={{ color: "#777" }}>{item.section.title}</div>
        )}
        {ps[0] && <p className="roadmap-text" style={{ color: live ? "#666" : "#999" }}>{ps[0]}</p>}
        {open && ps.slice(1).map((p, i) => (
          <p key={i} className="roadmap-text" style={{ color: live ? "#666" : "#999", marginTop: "8px" }}>{p}</p>
        ))}
        {ps.length > 1 && (
          <button className="roadmap-toggle" onClick={() => setOpen(!open)}>
            {open ? "접기" : "구상 내용 더 보기"}
          </button>
        )}
      </div>
    </li>
  );
}

export default function NextRoadmap({
  seriesTitle,
  currentTitle,
  items,
}: {
  seriesTitle?: string;
  currentTitle: string;
  items: NextItem[];
}) {
  return (
    <aside className="roadmap" aria-label="시리즈 다음 이야기">
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111" }}>{seriesTitle ?? "Series"}</span>
        <span style={{ fontSize: "12px", color: "#bbb" }}>이 주제로 이어지는 이야기</span>
      </div>
      <ol className="roadmap-list">
        <li className="roadmap-item">
          <span className="roadmap-dot" data-live="true">01</span>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>지금 읽은 글</div>
            <div className="roadmap-title" style={{ color: "#111" }}>{currentTitle}</div>
          </div>
        </li>
        {items.map((item, i) => <Step key={item.section.id} index={i + 2} item={item} />)}
      </ol>
    </aside>
  );
}
