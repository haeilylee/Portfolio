import React from "react";
import Link from "next/link";
import Image from "next/image";
import { projects, getProjectBySlug } from "@/lib/projects";
import type { Block, Section } from "@/lib/projects";
import { notFound } from "next/navigation";
import TocNav from "@/components/toc-nav";
import CodeBlock from "@/components/code-block";
import Reveal from "@/components/reveal";
import { gradientMap, categoryColor } from "@/lib/category-styles";

function renderWithHighlights(text: string, highlights: string[] = []) {
  if (!highlights.length) return <>&ldquo;{text}&rdquo;</>;
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  for (const phrase of highlights) {
    const idx = remaining.indexOf(phrase);
    if (idx === -1) continue;
    if (idx > 0) parts.push(remaining.slice(0, idx));
    parts.push(
      <span key={key++} style={{ background: "linear-gradient(transparent 55%, #fff176 55%)", padding: "0 1px" }}>
        {phrase}
      </span>
    );
    remaining = remaining.slice(idx + phrase.length);
  }
  if (remaining) parts.push(remaining);
  return <>&ldquo;{parts}&rdquo;</>;
}

function parseInlineCode(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = />([^<]+)</g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <code
        key={key++}
        style={{
          fontFamily: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
          fontSize: "0.85em",
          background: "#f2f2f2",
          border: "1px solid #e4e4e4",
          borderRadius: "5px",
          padding: "1px 6px",
          color: "#333",
          letterSpacing: "0",
        }}
      >
        {m[1]}
      </code>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderInlineText(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {parseInlineCode(line)}
    </React.Fragment>
  ));
}

function renderBlock(block: Block, idx: number) {
  if (block.type === "text") {
    return (
      <p
        key={idx}
        style={{
          fontSize: "15px",
          color: "#555",
          lineHeight: 1.8,
          letterSpacing: "-0.025em",
          margin: "0 0 16px",
          wordBreak: "keep-all",
        }}
      >
        {renderInlineText(block.content)}
      </p>
    );
  }
  if (block.type === "image") {
    return (
      <figure key={idx} style={{ margin: "24px 0" }}>
        <div style={{ borderRadius: "10px", overflow: "hidden" }}>
          <Image
            src={block.src}
            alt={block.alt ?? ""}
            width={680}
            height={400}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        {block.caption && (
          <figcaption style={{ fontSize: "12px", color: "#bbb", textAlign: "center", marginTop: "8px", letterSpacing: "-0.02em" }}>
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  if (block.type === "code") {
    return (
      <div key={idx} style={{ margin: "20px 0" }}>
        <CodeBlock
          code={block.code}
          lang={block.lang ?? "tsx"}
          filename={block.filename}
        />
      </div>
    );
  }
  if (block.type === "table") {
    return (
      <div
        key={idx}
        style={{
          margin: "20px 0",
          border: "1px solid #ececf0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {block.rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              padding: "14px 20px",
              borderTop: i === 0 ? "none" : "1px solid #ececf0",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontWeight: 700, color: "#1a3fd0", fontSize: "13px" }}>
              {row.term}
            </span>
            <span style={{ color: "#474c55", wordBreak: "keep-all" }}>{row.desc}</span>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === "list") {
    return (
      <ol key={idx} style={{ listStyle: "none", padding: 0, margin: "20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
        {block.items.map((item, i) => (
          <li
            key={i}
            style={{
              position: "relative",
              padding: "14px 16px 14px 50px",
              background: "#f5f6f8",
              borderRadius: "12px",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "#474c55",
              wordBreak: "keep-all",
            }}
          >
            <span style={{
              position: "absolute",
              left: "14px",
              top: "14px",
              width: "22px",
              height: "22px",
              borderRadius: "7px",
              background: "#2c5cff",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            {item.title && <strong style={{ color: "#111", fontWeight: 700 }}>{item.title}</strong>}{item.title ? " " : ""}{item.content}
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === "callout") {
    return (
      <div
        key={idx}
        style={{
          background: "#f0f4ff",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "20px 0",
        }}
      >
        {block.label && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#1a3fd0",
              letterSpacing: "0.02em",
              marginBottom: "6px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2c5cff", flexShrink: 0, display: "inline-block" }} />
            {block.label}
          </div>
        )}
        <p
          style={{
            fontSize: "14px",
            color: "#474c55",
            lineHeight: 1.75,
            letterSpacing: "-0.02em",
            margin: 0,
            wordBreak: "keep-all",
          }}
        >
          {block.content}
        </p>
      </div>
    );
  }
  if (block.type === "spacer") {
    return <div key={idx} style={{ height: `${block.height ?? 20}px` }} />;
  }
  return null;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project ? `${project.title} — Hakyeong Lee` : "Not Found" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const sections: Section[] = project.sections ?? [];
  const catColor = categoryColor[project.category] ?? "#888";

  const tocItems = [
    { id: "overview", label: "Overview" },
    ...sections.map((s) => ({ id: s.id, label: s.title })),
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          gap: "56px",
          alignItems: "flex-start",
        }}
      >
        <TocNav items={tocItems} />

        <article
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: "680px",
            padding: "48px 0 80px",
          }}
        >
          {/* Breadcrumb */}
          <div style={{ marginBottom: "28px" }}>
            <Link
              href="/"
              style={{
                fontSize: "13px",
                color: "#aaa",
                letterSpacing: "-0.02em",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ← Projects
            </Link>
          </div>

          {/* Category */}
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: catColor,
              marginBottom: "10px",
            }}
          >
            {project.category}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "#111",
              margin: "0 0 14px",
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h1>

          {/* Meta */}
          <p style={{ fontSize: "13px", color: "#bbb", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
            {project.date}
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#666",
              letterSpacing: "-0.025em",
              lineHeight: 1.7,
              margin: "0 0 36px",
            }}
          >
            {project.desc}
          </p>

          {/* Thumbnail */}
          <div
            style={{
              width: "100%",
              aspectRatio: "16/7",
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "40px",
              background: gradientMap[project.catClass] ?? "#ccc",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", bottom: "-70px", left: "60px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "rgba(255,255,255,0.18)",
                fontSize: "56px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {project.title}
            </div>
          </div>

          {/* Skills used */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "#ccc", fontWeight: 600, marginBottom: "10px" }}>
              Skills used
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    padding: "4px 11px",
                    borderRadius: "20px",
                    background: "#f2f2f2",
                    color: "#555",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "0 0 40px" }} />

          {/* Overview + Outcomes */}
          <section id="overview" style={{ marginBottom: "48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "40px" }}>
              <div>
                <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 14px" }}>
                  Overview
                </h2>
                <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.8, letterSpacing: "-0.025em", margin: 0 }}>
                  {project.desc}
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 14px" }}>
                  주요 성과
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {project.outcomes.map((o, i) => (
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {project.tools.map((tool, i) => (
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
            <p
              style={{
                fontSize: "15px",
                color: "#333",
                lineHeight: 1.85,
                letterSpacing: "-0.03em",
                margin: 0,
                wordBreak: "keep-all",
              }}
            >
              {renderWithHighlights(project.insight, project.insightHighlights)}
            </p>
          </section>

          {/* 코드 스니펫 */}
          {project.codeSnippet && (
            <section style={{ marginBottom: "52px" }}>
              <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ccc", fontWeight: 600, margin: "0 0 14px" }}>
                코드
              </h2>
              <CodeBlock
                code={project.codeSnippet.code}
                lang={project.codeSnippet.lang ?? "tsx"}
                filename={project.codeSnippet.filename}
              />
            </section>
          )}

          {/* 커스텀 섹션 */}
          {sections.length > 0 && (
            <>
              <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "0 0 48px" }} />
              {sections.map((section, si) => (
                <section
                  key={section.id}
                  id={section.id}
                  style={{ marginBottom: si < sections.length - 1 ? "44px" : 0 }}
                >
                  <Reveal>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        letterSpacing: "-0.04em",
                        color: "#111",
                        margin: "0 0 12px",
                      }}
                    >
                      {section.title}
                    </h3>
                  </Reveal>
                  {section.blocks.map((block, bi) => (
                    <Reveal key={bi} delay={bi * 60}>
                      {renderBlock(block, bi)}
                    </Reveal>
                  ))}
                </section>
              ))}
            </>
          )}
        </article>
      </div>
    </div>
  );
}
