"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import ProjectCard from "@/components/project-card";
import { COLLECTIONS, isCollectionId, type CollectionId } from "@/lib/collections";

/**
 * Public C — Velog 형.
 * 카드마다 카테고리 칩이 붙어 있고, 칩을 누르면 그 분류만 남는다.
 * 상단 칩 바와 카드의 칩이 같은 상태를 공유해서 "지금 무엇을 보고 있는지"가 두 군데서 보인다.
 */
export default function VelogChips({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<CollectionId | null>(null);

  const visible = active ? projects.filter((p) => p.collection === active) : projects;
  const current = COLLECTIONS.find((c) => c.id === active);

  function chipStyle(c: { color: string; soft: string }) {
    return { "--chip-color": c.color, "--chip-soft": c.soft } as React.CSSProperties;
  }

  return (
    <div className="pv-container">
      <div style={{ padding: "40px 0 24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 18px", lineHeight: 1.2 }}>
          Projects
        </h1>

        {/* 칩 바 */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <button className="pv-chip" data-active={active === null} onClick={() => setActive(null)}>
            전체 <span style={{ opacity: 0.6 }}>{projects.length}</span>
          </button>
          {COLLECTIONS.map((c) => {
            const n = projects.filter((p) => p.collection === c.id).length;
            return (
              <button
                key={c.id}
                className="pv-chip"
                data-active={active === c.id}
                style={chipStyle(c)}
                onClick={() => setActive(active === c.id ? null : c.id)}
              >
                {c.title} <span style={{ opacity: 0.6 }}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 현재 선택 상태 — 목록과의 관계를 문장으로 */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap",
          padding: "12px 14px", borderRadius: "10px",
          background: current ? current.soft : "#fafafa",
          marginBottom: "28px", fontSize: "13px", letterSpacing: "-0.02em",
          transition: "background 0.2s",
        }}
      >
        {current ? (
          <>
            <span style={{ fontWeight: 700, color: current.color }}>#{current.title.replace(" ", "")}</span>
            <span style={{ color: "#555" }}>{current.subtitle}</span>
            <span style={{ color: "#999" }}>· {visible.length}개</span>
            <button
              onClick={() => setActive(null)}
              style={{ marginLeft: "auto", fontSize: "12px", color: "#666", background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "99px", padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}
            >
              필터 해제 ×
            </button>
          </>
        ) : (
          <span style={{ color: "#999" }}>카드의 칩을 누르면 같은 분류의 프로젝트만 모아 볼 수 있어요.</span>
        )}
      </div>

      <div className="pv-grid">
        {visible.map((p) => {
          const c = COLLECTIONS.find((x) => x.id === p.collection);
          return (
            <ProjectCard
              key={p.slug}
              project={p}
              eyebrow={
                c ? (
                  <button
                    className="pv-chip"
                    data-tone="soft"
                    data-active={active === c.id}
                    style={chipStyle(c)}
                    title={`${c.title}만 보기`}
                    onClick={(e) => {
                      // 카드(Link) 이동을 막고 필터만 바꾼다
                      e.preventDefault();
                      e.stopPropagation();
                      setActive(active === c.id ? null : c.id);
                    }}
                  >
                    #{c.title.replace(" ", "")}
                  </button>
                ) : (
                  <span className="pv-chip" data-tone="soft" data-muted="true">미분류</span>
                )
              }
            />
          );
        })}
      </div>

      {visible.length === 0 && (
        <div style={{ padding: "64px 0", textAlign: "center", fontSize: "13px", color: "#bbb" }}>
          이 분류에 지정된 프로젝트가 아직 없어요.
        </div>
      )}

      {!active && projects.some((p) => !isCollectionId(p.collection)) && (
        <p style={{ fontSize: "12px", color: "#bbb", marginTop: "24px", letterSpacing: "-0.02em" }}>
          미분류 프로젝트는 전체 목록에만 보이고, 칩 필터에서는 제외돼요.
        </p>
      )}
      <div style={{ height: "80px" }} />
    </div>
  );
}
