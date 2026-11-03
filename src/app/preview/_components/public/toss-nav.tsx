"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/projects";
import ProjectCard from "@/components/project-card";
import { COLLECTIONS, isCollectionId, type CollectionId } from "@/lib/collections";

type Key = "all" | CollectionId;

/**
 * Public A — Toss Tech 형.
 * 상단 탭으로 카테고리를 고르면, 그 아래 카테고리 제목·부제가 바뀌고 목록이 필터링된다.
 * URL ?category= 와 동기화해 특정 카테고리 상태를 링크로 공유할 수 있다.
 */
export default function TossNav({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get("category");
  const [active, setActive] = useState<Key>(isCollectionId(fromUrl) ? fromUrl : "all");

  useEffect(() => {
    const q = active === "all" ? "" : `?category=${active}`;
    router.replace(`/preview/public/a${q}`, { scroll: false });
  }, [active, router]);

  const counts: Record<Key, number> = {
    all: projects.length,
    "knowledge-systems": projects.filter((p) => p.collection === "knowledge-systems").length,
    "design-systems": projects.filter((p) => p.collection === "design-systems").length,
  };
  const unassigned = projects.filter((p) => !isCollectionId(p.collection)).length;

  const visible = active === "all" ? projects : projects.filter((p) => p.collection === active);
  const current = COLLECTIONS.find((c) => c.id === active);

  return (
    <div className="pv-container">
      {/* 탭 */}
      <div className="pv-tabs" role="tablist" style={{ marginTop: "20px" }}>
        <button role="tab" className="pv-tab" data-active={active === "all"} onClick={() => setActive("all")}>
          전체<span className="pv-tab-count">{counts.all}</span>
        </button>
        {COLLECTIONS.map((c) => (
          <button key={c.id} role="tab" className="pv-tab" data-active={active === c.id} onClick={() => setActive(c.id)}>
            {c.title}<span className="pv-tab-count">{counts[c.id]}</span>
          </button>
        ))}
      </div>

      {/* 카테고리 헤더 — Toss Tech의 카테고리 제목 + 소개 문구 */}
      <div style={{ padding: "40px 0 32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: current ? current.color : "#bbb", marginBottom: "10px" }}>
          {current ? "Category" : "All Projects"}
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>
          {current ? current.title : "모든 프로젝트"}
        </h1>
        <p style={{ fontSize: "14px", color: "#666", letterSpacing: "-0.025em", lineHeight: 1.7, margin: 0, maxWidth: "520px" }}>
          {current ? current.subtitle : "흩어진 지식과 암묵적 판단을 AI와 사람이 함께 쓸 수 있는 문서 체계로 만든 기록이에요."}
        </p>
      </div>

      {/* 목록 헤더 */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "#ccc", fontWeight: 600 }}>
          Projects
        </span>
        <span style={{ fontSize: "11px", color: "#ddd", letterSpacing: "-0.02em" }}>
          {visible.length} works
          {active === "all" && unassigned > 0 && ` · 미분류 ${unassigned}`}
        </span>
      </div>

      <div className="pv-grid">
        {visible.map((p) => {
          const c = COLLECTIONS.find((x) => x.id === p.collection);
          return (
            <ProjectCard
              key={p.slug}
              project={p}
              eyebrow={
                <>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: c ? c.color : "#aaa", letterSpacing: "-0.01em" }}>
                    {c ? c.title : "미분류"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#e0e0e0" }}>·</span>
                  <span style={{ fontSize: "11px", color: "#bbb" }}>{p.category}</span>
                </>
              }
            />
          );
        })}
      </div>

      {visible.length === 0 && (
        <div style={{ padding: "64px 0", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: "#bbb", marginBottom: "12px" }}>이 카테고리에 지정된 프로젝트가 아직 없어요.</div>
          <button className="pv-chip" onClick={() => setActive("all")}>전체 보기</button>
        </div>
      )}

      <div style={{ height: "80px" }} />
    </div>
  );
}
