"use client";

import Link from "next/link";
import { Project } from "@/lib/projects";

const gradientMap: Record<string, string> = {
  "design-system": "linear-gradient(145deg, #1a4fd6, #4f86f7)",
  ai: "linear-gradient(145deg, #5b21b6, #a78bfa)",
  ux: "linear-gradient(145deg, #065f46, #34d399)",
};

const categoryColor: Record<string, string> = {
  "Design System": "#2d5cd8",
  AI: "#7031d4",
  "UX Research": "#168f52",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        const thumb = (e.currentTarget as HTMLAnchorElement).querySelector(
          ".thumb"
        ) as HTMLElement;
        if (thumb) thumb.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        const thumb = (e.currentTarget as HTMLAnchorElement).querySelector(
          ".thumb"
        ) as HTMLElement;
        if (thumb) thumb.style.transform = "scale(1)";
      }}
    >
      {/* Thumbnail — no card border, just the image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/10",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          className="thumb"
          style={{
            width: "100%",
            height: "100%",
            background: gradientMap[project.catClass] ?? "#ccc",
            transition: "transform 0.3s ease",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30px",
              right: "-30px",
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "30px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
        </div>
      </div>

      {/* Text — no box, just typography */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: categoryColor[project.category] ?? "#888",
          }}
        >
          {project.category}
        </span>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#111",
            margin: 0,
            lineHeight: 1.35,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#888",
            margin: 0,
            lineHeight: 1.6,
            letterSpacing: "-0.02em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.preview}
        </p>
        <span style={{ fontSize: "12px", color: "#bbb", letterSpacing: "-0.01em", marginTop: "2px" }}>
          {project.date}
        </span>
      </div>
    </Link>
  );
}
