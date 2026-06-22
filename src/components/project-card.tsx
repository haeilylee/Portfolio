import Link from "next/link";
import { Project } from "@/lib/projects";

const gradientMap: Record<string, string> = {
  "design-system": "linear-gradient(145deg, #1a4fd6, #4f86f7)",
  ai: "linear-gradient(145deg, #5b21b6, #a78bfa)",
  ux: "linear-gradient(145deg, #065f46, #34d399)",
};

const badgeBgMap: Record<string, string> = {
  "design-system": "rgba(26, 79, 214, 0.85)",
  ai: "rgba(91, 33, 182, 0.85)",
  ux: "rgba(6, 95, 70, 0.85)",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLAnchorElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: gradientMap[project.catClass] ?? "#ccc",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "20px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Category badge */}
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: badgeBgMap[project.catClass] ?? "rgba(0,0,0,0.5)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: "4px",
            backdropFilter: "blur(4px)",
            letterSpacing: "-0.01em",
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "14px 16px 16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "6px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "var(--tx-1)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "var(--tx-3)",
            margin: 0,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.preview}
        </p>
        <div
          style={{
            marginTop: "auto",
            paddingTop: "8px",
            fontSize: "12px",
            color: "var(--tx-3)",
          }}
        >
          {project.date}
        </div>
      </div>
    </Link>
  );
}
