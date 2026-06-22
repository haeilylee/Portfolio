"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";
import ProjectCard from "@/components/project-card";

const ALL_PILLS = ["전체", "Design System", "AI", "UX Research", "Product"];

export default function FilterBar({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("전체");

  const visible =
    active === "전체"
      ? projects
      : projects.filter((p) => p.tags.includes(active));

  return (
    <div>
      {/* Filter pills */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        {ALL_PILLS.map((pill) => (
          <button
            key={pill}
            onClick={() => setActive(pill)}
            style={{
              fontSize: "13px",
              padding: "5px 12px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "-0.02em",
              transition: "background 0.15s, color 0.15s",
              background: active === pill ? "#111111" : "#ededed",
              color: active === pill ? "#ffffff" : "#444444",
              fontWeight: active === pill ? 600 : 400,
            }}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "var(--tx-1)",
          marginBottom: "16px",
        }}
      >
        Projects
      </div>

      {/* Project grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px 24px",
        }}
      >
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visible.length === 0 && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--tx-3)",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          해당 카테고리의 프로젝트가 없어요.
        </p>
      )}
    </div>
  );
}
