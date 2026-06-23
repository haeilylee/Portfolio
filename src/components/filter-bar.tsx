"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";
import ProjectCard from "@/components/project-card";

const ALL_PILLS = ["전체", "Design System", "AI", "UX Research", "Product"];

interface FilterBarProps {
  projects: Project[];
  pillsOnly?: boolean;
  gridOnly?: boolean;
}

export default function FilterBar({ projects, pillsOnly, gridOnly }: FilterBarProps) {
  const [active, setActive] = useState("전체");

  const visible =
    active === "전체"
      ? projects
      : projects.filter((p) => p.tags.includes(active));

  if (pillsOnly) {
    return (
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
        {ALL_PILLS.map((pill) => (
          <button
            key={pill}
            onClick={() => setActive(pill)}
            style={{
              fontSize: "12px",
              padding: "5px 14px",
              borderRadius: "99px",
              border: "1px solid",
              borderColor: active === pill ? "#111" : "#e0e0e0",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "-0.02em",
              transition: "all 0.15s",
              background: active === pill ? "#111" : "#fafafa",
              color: active === pill ? "#fff" : "#666",
              fontWeight: active === pill ? 600 : 400,
            }}
          >
            {pill}
          </button>
        ))}
      </div>
    );
  }

  if (gridOnly) {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#ccc",
              fontWeight: 600,
            }}
          >
            Projects
          </span>
          <span style={{ fontSize: "11px", color: "#ddd", letterSpacing: "-0.02em" }}>
            {visible.length} works
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px 20px",
          }}
        >
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {visible.length === 0 && (
          <p style={{ fontSize: "13px", color: "#bbb", textAlign: "center", padding: "48px 0" }}>
            해당 카테고리의 프로젝트가 없어요.
          </p>
        )}
      </>
    );
  }

  // fallback: both
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
        {ALL_PILLS.map((pill) => (
          <button
            key={pill}
            onClick={() => setActive(pill)}
            style={{
              fontSize: "12px",
              padding: "5px 14px",
              borderRadius: "99px",
              border: "1px solid",
              borderColor: active === pill ? "#111" : "#e0e0e0",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "-0.02em",
              transition: "all 0.15s",
              background: active === pill ? "#111" : "#fafafa",
              color: active === pill ? "#fff" : "#666",
              fontWeight: active === pill ? 600 : 400,
            }}
          >
            {pill}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px 20px" }}>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
