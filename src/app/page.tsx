import Image from "next/image";
import { projects } from "@/lib/projects";
import FilterBar from "@/components/filter-bar";

export default function HomePage() {
  return (
    <div style={{ padding: "0 0 60px" }}>
      {/* Hero section */}
      <div
        style={{
          padding: "48px 40px 40px",
          borderBottom: "1px solid #e5e5e5",
          background: "#ffffff",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#e0e0e0",
              flexShrink: 0,
            }}
          >
            <Image
              src="/profile.webp"
              alt="Hakyeong Lee"
              width={28}
              height={28}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          <span
            style={{
              fontSize: "13px",
              color: "var(--tx-3)",
              letterSpacing: "-0.02em",
            }}
          >
            Product Designer · PM
          </span>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            color: "var(--tx-1)",
            margin: "0 0 10px",
            lineHeight: 1.2,
          }}
        >
          Hakyeong Lee
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "13px",
            color: "var(--tx-3)",
            margin: "0 0 24px",
            lineHeight: 1.6,
            maxWidth: "480px",
          }}
        >
          디자인 시스템, AI 자동화, UX 리서치를 통해 팀의 문제를 해결하는 포트폴리오입니다.
        </p>

        {/* Filter + grid (client) */}
        <FilterBar projects={projects} />
      </div>
    </div>
  );
}
