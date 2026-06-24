"use client";

import { useState } from "react";

type Tool = { name: string; desc: string };

export function ProjectInfoPanel({
  desc,
  outcomes,
  tools,
  insight,
}: {
  desc: string;
  outcomes: string[];
  tools: Tool[];
  insight: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 구분선 + 토글 버튼 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 40px" }}>
        <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "none",
            border: "1px solid #e8e8e8",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#aaa",
            letterSpacing: "0.02em",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          프로젝트 정보
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
      </div>

      {/* 접히는 내용 */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "2000px" : "0px",
          opacity: open ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.25s ease",
          marginBottom: open ? "0" : "0",
        }}
      >
        {/* Overview + Outcomes */}
        <section id="overview" style={{ marginBottom: "48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "40px" }}>
            <div>
              <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 14px" }}>
                Overview
              </h2>
              <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.8, letterSpacing: "-0.025em", margin: 0 }}>
                {desc}
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 14px" }}>
                주요 성과
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {outcomes.map((o, i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#555", lineHeight: 1.6, letterSpacing: "-0.02em" }}>
                    <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>✓</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tools & Stack */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 16px" }}>
            Tools &amp; Stack
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {tools.map((tool, i) => (
              <div
                key={tool.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "16px",
                  padding: "12px 0",
                  borderTop: i === 0 ? "1px solid #f0f0f0" : "none",
                  borderBottom: "1px solid #f0f0f0",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#222", letterSpacing: "-0.03em" }}>{tool.name}</span>
                <span style={{ fontSize: "13px", color: "#888", letterSpacing: "-0.02em", lineHeight: 1.6 }}>{tool.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 핵심 인사이트 */}
        <section style={{ marginBottom: "52px" }}>
          <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 14px" }}>
            핵심 인사이트
          </h2>
          <p style={{ fontSize: "15px", color: "#333", lineHeight: 1.85, letterSpacing: "-0.02em", margin: 0, wordBreak: "keep-all" }}>
            {insight}
          </p>
        </section>
      </div>
    </>
  );
}
