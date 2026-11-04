import React from "react";
import Link from "next/link";
import type { Project, Section } from "@/lib/projects";
import { gradientMap, categoryColor } from "@/lib/category-styles";
import { getCollection } from "@/lib/collections";
import { renderTitle, stripTitleBreaks } from "@/lib/format-title";
import { renderBlock, renderWithHighlights } from "@/components/project-blocks";
import TocNav from "@/components/toc-nav";
import ReadingProgress from "@/components/reading-progress";
import Reveal from "@/components/reveal";
import CodeBlock from "@/components/code-block";
import ClapFloat from "@/components/clap-float";
import CommentSection from "@/components/comment-section";
import NextRoadmap from "@/components/next-roadmap";
import { getProjectBySlug } from "@/lib/projects";

/**
 * 프로젝트 상세 — 글 중심 본문 구성.
 *  · 상단: 컬렉션·카테고리·기간 eyebrow → 제목 → 요약 → 히어로 → 핵심 인사이트(인용)
 *  · 중단: Skills / Tools 컴팩트 2단
 *  · 하단: 섹션·블록 (TOC·읽기 진행바) → 다음 이야기(시리즈 로드맵) → 댓글
 *  · 우하단: 박수(1인 1회)
 */
export default function ProjectDetail({ project }: { project: Project }) {
  const all: Section[] = project.sections ?? [];
  // kind: "next" 섹션은 본문·목차에서 빼고, 본문 끝 시리즈 로드맵으로 그린다
  const nextSections = all.filter((s) => s.kind === "next");
  const sections = all.filter((s) => s.kind !== "next");
  const collection = getCollection(project.collection);
  const hero = project.heroThumbnail ?? project.thumbnail;

  const tocItems = [
    { id: "overview", label: project.overviewLabel || "Overview" },
    ...sections.map((s) => ({ id: s.id, label: s.title, group: s.group })),
  ];

  const h2: React.CSSProperties = { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111", margin: "0 0 14px" };
  const eyebrowLabel: React.CSSProperties = { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "#ccc", fontWeight: 600, marginBottom: "10px" };

  return (
    <div className="project-detail-page" style={{ background: "#fff", minHeight: "100vh" }}>
      <TocNav items={tocItems} />
      <ReadingProgress />
      <ClapFloat slug={project.slug} />

      <div className="project-detail-container" style={{ maxWidth: "808px", margin: "0 auto", padding: "0 24px" }}>
        <article style={{ padding: "40px 0 80px" }}>
          <div style={{ marginBottom: "24px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "#aaa", letterSpacing: "-0.02em" }}>← Projects</Link>
          </div>

          {/* Eyebrow: 컬렉션 · 카테고리 · 기간 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px", fontSize: "11px", fontWeight: 600, letterSpacing: "-0.01em" }}>
            {collection && (
              <>
                <Link href="/" style={{ color: collection.color }}>{collection.title}</Link>
                <span style={{ color: "#e0e0e0" }}>·</span>
              </>
            )}
            <span style={{ color: categoryColor[project.category] ?? "#888" }}>{project.category}</span>
            <span style={{ color: "#e0e0e0" }}>·</span>
            <span style={{ color: "#bbb", fontWeight: 500 }}>{project.date}</span>
          </div>

          <h1 style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.055em", color: "#111", lineHeight: 1.25, margin: "0 0 16px" }}>
            {renderTitle(project.title)}
          </h1>

          <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/8", background: hero ? "#eee" : gradientMap[project.catClass] ?? "#ccc", marginBottom: "36px" }}>
            {hero && <img src={hero} alt={stripTitleBreaks(project.title)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>


          <h2 style={h2}>핵심 인사이트</h2>
          <blockquote style={{ margin: "0 0 36px", padding: "18px 22px", borderLeft: "3px solid #111", background: "#fafafa", fontSize: "14px", color: "#444", lineHeight: 1.8, letterSpacing: "-0.025em", wordBreak: "keep-all" }}>
            {renderWithHighlights(project.insight, project.insightHighlights)}
          </blockquote>

          {/* Skills & Tools — 컴팩트 2단 */}
          <div className="detail-meta">
            <div>
              <div style={eyebrowLabel}>Skills used</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "-0.02em", padding: "4px 11px", borderRadius: "20px", background: "#f2f2f2", color: "#555" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={eyebrowLabel}>Tools &amp; Stack</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {project.tools.map((tool) => (
                  <div key={tool.name} style={{ display: "flex", gap: "8px", fontSize: "13px", lineHeight: 1.5, letterSpacing: "-0.02em" }}>
                    <span style={{ fontWeight: 600, color: "#222", flexShrink: 0 }}>{tool.name}</span>
                    <span style={{ color: "#999" }}>{tool.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {project.codeSnippet?.code && (
            <section style={{ marginTop: "40px" }}>
              <div style={eyebrowLabel}>코드</div>
              <CodeBlock code={project.codeSnippet.code} lang={project.codeSnippet.lang ?? "tsx"} filename={project.codeSnippet.filename} />
            </section>
          )}

          {sections.length > 0 && (
            <>
              <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "48px 0 56px" }} />
              {sections.map((section, si) => (
                <section key={section.id} id={section.id} style={{ marginBottom: si < sections.length - 1 ? "56px" : 0 }}>
                  <Reveal>
                    <h3 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111", margin: "0 0 18px" }}>{section.title}</h3>
                  </Reveal>
                  {section.blocks.map((block, bi) => (
                    <Reveal key={bi} delay={bi * 60}>{renderBlock(block, bi)}</Reveal>
                  ))}
                </section>
              ))}
            </>
          )}

          {nextSections.length > 0 && (
            <NextRoadmap
              seriesTitle={collection?.title}
              currentTitle={stripTitleBreaks(project.title)}
              items={nextSections.map((section) => {
                const linked = section.nextSlug ? getProjectBySlug(section.nextSlug) : undefined;
                return { section, linked: linked ? { slug: linked.slug, title: stripTitleBreaks(linked.title) } : undefined };
              })}
            />
          )}

          <div id="comments" style={{ scrollMarginTop: "80px" }}>
            <CommentSection slug={project.slug} />
          </div>
        </article>
      </div>
    </div>
  );
}
