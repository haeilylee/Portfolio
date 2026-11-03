"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { gradientMap } from "@/lib/category-styles";
import { renderTitle, stripTitleBreaks } from "@/lib/format-title";
import { UNASSIGNED, groupByCollection, type Collection } from "@/lib/collections";

type SeriesDef = Collection | typeof UNASSIGNED;
type Focus = SeriesDef["id"] | null;

/**
 * Public B — Brunchbook 형.
 * 카테고리를 "연재 시리즈"로 읽는다. 왼쪽에 시리즈 제목·소개(sticky), 오른쪽에 에피소드가
 * 번호를 달고 이어진다. "시리즈 보기"를 누르면 그 시리즈만 남고 표지(cover)가 펼쳐진다.
 */
export default function BrunchSeries({ projects }: { projects: Project[] }) {
  const [focus, setFocus] = useState<Focus>(null);
  const { groups, unassigned } = groupByCollection(projects);

  const series: { def: SeriesDef; items: Project[] }[] = [
    ...groups.map((g) => ({ def: g.collection, items: g.items })),
    ...(unassigned.length ? [{ def: UNASSIGNED, items: unassigned }] : []),
  ];

  const shown = focus ? series.filter((s) => s.def.id === focus) : series;

  return (
    <div className="pv-container">
      {/* 상단 헤더 / 포커스 모드 표지 */}
      {focus ? (
        <Cover
          def={shown[0].def}
          count={shown[0].items.length}
          onBack={() => setFocus(null)}
        />
      ) : (
        <div style={{ padding: "40px 0 8px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bbb", marginBottom: "10px" }}>
            Collections
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>
            두 가지 주제로 이어 쓰는 기록
          </h1>
          <p style={{ fontSize: "14px", color: "#666", letterSpacing: "-0.025em", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "520px" }}>
            각 프로젝트는 독립된 글이지만, 같은 주제 아래에서 하나의 연재처럼 읽을 수 있어요.
          </p>
          {/* 시리즈 바로가기 */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
            {series.map(({ def, items }) => (
              <button
                key={def.id}
                className="pv-chip"
                data-tone="soft"
                style={{ "--chip-color": def.color, "--chip-soft": def.soft } as React.CSSProperties}
                onClick={() => setFocus(def.id)}
              >
                {def.title} <span style={{ opacity: 0.6 }}>{items.length}편</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {shown.map(({ def, items }) => (
        <section key={def.id} className="pv-series" style={focus ? { borderTop: "none", paddingTop: "8px" } : undefined}>
          {/* 좌: 시리즈 소개 */}
          <div className="pv-series-intro">
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: def.color, marginBottom: "10px" }}>
              Series · {items.length}편
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 10px", lineHeight: 1.25 }}>
              {def.title}
            </h2>
            <p style={{ fontSize: "13px", color: "#666", letterSpacing: "-0.025em", lineHeight: 1.7, margin: "0 0 18px" }}>
              {def.subtitle}
            </p>
            {!focus && (
              <button
                onClick={() => setFocus(def.id)}
                style={{ fontSize: "12px", fontWeight: 600, color: "#111", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, letterSpacing: "-0.02em" }}
              >
                시리즈 보기 →
              </button>
            )}
          </div>

          {/* 우: 에피소드 */}
          <div>
            {items.length === 0 && (
              <div style={{ fontSize: "13px", color: "#bbb", padding: "8px 0" }}>이 시리즈에 묶인 프로젝트가 아직 없어요.</div>
            )}
            {items.map((p, i) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="pv-episode">
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#ddd", letterSpacing: "-0.04em", lineHeight: 1, paddingTop: "2px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="pv-episode-thumb"
                  style={{ borderRadius: "8px", aspectRatio: "4/3", overflow: "hidden", background: p.thumbnail ? "#eee" : gradientMap[p.catClass] ?? "#ccc" }}
                >
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt={stripTitleBreaks(p.title)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div className="pv-episode-body">
                  <div style={{ fontSize: "11px", color: "#bbb", marginBottom: "6px", letterSpacing: "-0.01em" }}>
                    {p.date} · {p.category}
                  </div>
                  <div className="pv-episode-title" style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111", lineHeight: 1.35, marginBottom: "6px" }}>
                    {renderTitle(p.title)}
                  </div>
                  <p style={{ fontSize: "13px", color: "#888", margin: 0, lineHeight: 1.6, letterSpacing: "-0.02em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.preview}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {focus && (
        <div style={{ padding: "24px 0 0", borderTop: "1px solid #f0f0f0", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#bbb", marginRight: "6px" }}>다른 시리즈</span>
          {series.filter((s) => s.def.id !== focus).map(({ def, items }) => (
            <button
              key={def.id}
              className="pv-chip"
              data-tone="soft"
              style={{ "--chip-color": def.color, "--chip-soft": def.soft } as React.CSSProperties}
              onClick={() => { setFocus(def.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              {def.title} <span style={{ opacity: 0.6 }}>{items.length}편</span>
            </button>
          ))}
        </div>
      )}
      <div style={{ height: "80px" }} />
    </div>
  );
}

/**
 * 시리즈 포커스 헤더 — Toss Tech 카테고리 페이지처럼 배경 없이
 * 제목 + 한 줄 소개만. ("Engineering / 토스 엔지니어들이 기술로 문제를 정의하고 해결해 가는 여정을 만나보세요")
 */
function Cover({ def, count, onBack }: { def: SeriesDef; count: number; onBack: () => void }) {
  return (
    <div style={{ padding: "40px 0 8px" }}>
      <button
        onClick={onBack}
        style={{ fontSize: "13px", color: "#aaa", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", marginBottom: "28px", letterSpacing: "-0.02em" }}
      >
        ← 모든 시리즈
      </button>
      <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>
        {def.title}
      </h1>
      <p style={{ fontSize: "14px", color: "#666", letterSpacing: "-0.025em", lineHeight: 1.7, margin: 0, maxWidth: "520px" }}>
        {def.subtitle}
      </p>
      <div style={{ fontSize: "12px", color: "#bbb", letterSpacing: "-0.01em", marginTop: "14px" }}>{count}편</div>
    </div>
  );
}
