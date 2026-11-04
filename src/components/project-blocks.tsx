import React from "react";
import type { Block } from "@/lib/projects";
import CodeBlock from "@/components/code-block";
import ImageZoom from "@/components/image-zoom";

/**
 * 프로젝트 상세 본문 블록 렌더러.
 * /projects/[slug] 상세 본문 블록 렌더링.
 */

export function renderWithHighlights(text: string, highlights: string[] = []) {
  if (!highlights.length) return <>&ldquo;{text}&rdquo;</>;
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  for (const phrase of highlights) {
    const idx = remaining.indexOf(phrase);
    if (idx === -1) continue;
    if (idx > 0) parts.push(remaining.slice(0, idx));
    parts.push(
      <span key={key++} style={{ background: "linear-gradient(transparent 55%, rgba(49, 130, 246, 0.23) 55%)", padding: "0 1px", fontWeight: 700, color: "#111" }}>
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
  const re = /\*\*([^*]+)\*\*|>([^<]+)</g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={key++} style={{ fontWeight: 700, color: "inherit" }}>{m[1]}</strong>);
    } else {
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
          {m[2]}
        </code>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function renderInlineText(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {parseInlineCode(line)}
    </React.Fragment>
  ));
}

const stepTagColors: Record<string, { bg: string; fg: string }> = {
  green: { bg: "#e7f6ec", fg: "#1f8a4c" },
  purple: { bg: "#efeafd", fg: "#6d3fd6" },
  blue: { bg: "#e8f1ff", fg: "#1a5fd0" },
  orange: { bg: "#fff2e3", fg: "#c76a12" },
  gray: { bg: "#f0f0f0", fg: "#666" },
};

export function renderBlock(block: Block, idx: number) {
  if (block.type === "step") {
    const colors = stepTagColors[block.tagColor ?? "gray"] ?? stepTagColors.gray;
    return (
      <div key={idx} style={{ margin: "0 0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#111", letterSpacing: "-0.03em" }}>
            {block.step ? `Step ${block.step} · ` : ""}{block.title}
          </span>
          {block.tag && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                padding: "3px 10px",
                borderRadius: "20px",
                background: colors.bg,
                color: colors.fg,
              }}
            >
              {block.tag}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: "17px",
            color: "#555",
            lineHeight: 1.8,
            letterSpacing: "-0.02em",
            margin: 0,
            wordBreak: "keep-all",
          }}
        >
          {renderInlineText(block.content)}
        </p>
      </div>
    );
  }
  if (block.type === "text") {
    return (
      <p
        key={idx}
        style={{
          fontSize: "17px",
          color: "#555",
          lineHeight: 1.8,
          letterSpacing: "-0.02em",
          margin: "0 0 28px",
          wordBreak: "keep-all",
        }}
      >
        {renderInlineText(block.content)}
      </p>
    );
  }
  if (block.type === "image") {
    return (
      <figure key={idx} style={{ margin: "32px 0" }}>
        <ImageZoom src={block.src} alt={block.alt ?? ""} />
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
      <div key={idx} style={{ margin: "32px 0" }}>
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
          margin: "28px 0",
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
              fontSize: "15px",
              lineHeight: 1.65,
            }}
          >
            <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontWeight: 700, color: "#1a3fd0", fontSize: "14px" }}>
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
      <ol key={idx} style={{ listStyle: "none", padding: 0, margin: "28px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
        {block.items.map((item, i) => (
          <li
            key={i}
            style={{
              position: "relative",
              padding: "14px 16px 14px 50px",
              background: "#f5f6f8",
              borderRadius: "12px",
              fontSize: "16px",
              lineHeight: 1.75,
              letterSpacing: "-0.02em",
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
          padding: "20px 24px",
          margin: "28px 0",
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
            fontSize: "16px",
            color: "#474c55",
            lineHeight: 1.8,
            letterSpacing: "-0.02em",
            margin: 0,
            wordBreak: "keep-all",

          }}
        >
          {renderInlineText(block.content)}
        </p>
      </div>
    );
  }
  if (block.type === "spacer") {
    return <div key={idx} style={{ height: `${block.height ?? 20}px` }} />;
  }
  if (block.type === "divider") {
    return <hr key={idx} style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "32px 0" }} />;
  }
  return null;
}
