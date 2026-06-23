import Image from "next/image";
import Link from "next/link";
import { projects, hero } from "@/lib/projects";

const gradientMap: Record<string, string> = {
  "design-system": "linear-gradient(145deg, #1a4fd6 0%, #4f86f7 100%)",
  ai: "linear-gradient(145deg, #5b21b6 0%, #a78bfa 100%)",
  ux: "linear-gradient(145deg, #065f46 0%, #34d399 100%)",
};

const categoryColor: Record<string, string> = {
  "Design System": "#2d5cd8",
  AI: "#7031d4",
  "UX Research": "#168f52",
};

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function HomePage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 56px" }}>

        {/* ── Hero (E형: 2컬럼) ── */}
        <div
          style={{
            padding: "52px 0 40px",
            borderBottom: "1px solid #f0f0f0",
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "32px",
            alignItems: "center",
          }}
        >
          {/* 왼쪽: 아바타 + 이름 + 직함 */}
          <div>
            <Image
              src="/profile.webp"
              alt="Hakyeong Lee"
              width={72}
              height={72}
              style={{ height: "72px", width: "auto", objectFit: "contain", display: "block", marginBottom: "14px" }}
            />
            <div style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", lineHeight: 1.2 }}>
              {hero.name}
            </div>
            <div style={{ fontSize: "12px", color: "#bbb", letterSpacing: "-0.02em", marginTop: "4px" }}>
              {hero.role}
            </div>
          </div>

          {/* 오른쪽: 바이오 + GitHub/LinkedIn */}
          <div>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, letterSpacing: "-0.025em", maxWidth: "480px", marginBottom: "16px", whiteSpace: "pre-line" }}>
              {hero.bio}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a
                href={hero.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#666",
                  textDecoration: "none",
                  padding: "5px 11px",
                  borderRadius: "20px",
                  background: "#f2f2f2",
                  letterSpacing: "-0.01em",
                }}
              >
                <GitHubIcon />
                GitHub
              </a>
              <a
                href={hero.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#666",
                  textDecoration: "none",
                  padding: "5px 11px",
                  borderRadius: "20px",
                  background: "#f2f2f2",
                  letterSpacing: "-0.01em",
                }}
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* ── Projects list ── */}
        <div style={{ padding: "40px 0 80px", display: "grid", gridTemplateColumns: "180px 1fr", gap: "32px" }}>

          {/* 맨 왼쪽: 섹션 레이블 */}
          <div style={{ paddingTop: "4px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, fontStyle: "italic", color: "#111", letterSpacing: "-0.025em", lineHeight: 1.4 }}>
              Representative<br />Projects
            </div>
            <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px", letterSpacing: "-0.02em" }}>
              대표 프로젝트
            </div>
          </div>

          {/* 오른쪽: 프로젝트 행들 (썸네일 | 내용 | 링크) */}
          <div>
            {projects.map((project, idx) => (
              <div
                key={project.slug}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr auto",
                  gap: "24px",
                  borderTop: idx === 0 ? "none" : "1px solid #f0f0f0",
                  padding: "24px 0",
                  alignItems: "flex-start",
                }}
              >
                {/* 썸네일 */}
                <div
                  style={{
                    borderRadius: "8px",
                    aspectRatio: "4/3",
                    background: gradientMap[project.catClass] ?? "#ccc",
                  }}
                />

                {/* 내용 */}
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: categoryColor[project.category] ?? "#888" }}>
                      {project.category}
                    </span>
                    <span style={{ fontSize: "11px", color: "#e0e0e0" }}>·</span>
                    <span style={{ fontSize: "11px", color: "#ccc" }}>{project.date}</span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111", lineHeight: 1.3, marginBottom: "10px" }}>
                    {project.title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {project.outcomes.map((outcome, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#666", lineHeight: 1.7, letterSpacing: "-0.025em" }}>
                        <span style={{ color: "#bbb", flexShrink: 0, fontSize: "10px", marginTop: "3px" }}>•</span>
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 링크 */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="proj-link"
                  style={{ fontSize: "11px", fontWeight: 600, color: "#000", whiteSpace: "nowrap", letterSpacing: "-0.01em", paddingTop: "2px" }}
                >
                  프로젝트 링크 →
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
