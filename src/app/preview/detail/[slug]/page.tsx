import Link from "next/link";
import { notFound } from "next/navigation";
import { readContentLive } from "@/lib/content-live";
import type { Section } from "@/lib/projects";
import { gradientMap, categoryColor } from "@/lib/category-styles";
import { getCollection } from "@/lib/collections";
import { renderTitle, stripTitleBreaks } from "@/lib/format-title";
import { renderBlock, renderWithHighlights } from "@/components/project-blocks";
import TocNav from "@/components/toc-nav";
import ReadingProgress from "@/components/reading-progress";
import Reveal from "@/components/reveal";
import ReferenceBadge from "../../_components/reference-badge";
import ClapAFloat from "../../_components/reaction/clap-a-float";

export const dynamic = "force-dynamic";

/**
 * 상세 페이지 최종 뷰 시안 — reaction/a 에서 마음에 들었던 본문 구성을 실제 상세 데이터 전체에 적용.
 *  · 상단: 컬렉션·카테고리·기간 eyebrow → 큰 제목 → 요약 → 히어로 → 주요 성과 → 핵심 인사이트(인용)
 *  · 중단: Skills / Tools 를 한 줄짜리 컴팩트 블록으로
 *  · 하단: 기존 섹션·블록 렌더러 그대로 (TOC·읽기 진행바 유지)
 *  · 우하단: Clap(하루 5회)
 */
export default async function PreviewDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects } = await readContentLive();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const sections: Section[] = project.sections ?? [];
  const collection = getCollection(project.collection);
  const hero = project.heroThumbnail ?? project.thumbnail;

  const sectionGroups: Record<string, string[]> = {
    "ai-requirements": ["Background", "Background", "Problem & Solution", "Problem & Solution", "Workflow", "Workflow", "Workflow", "Insight"],
    sdui: ["Problem", "Solution", "Workflow", "Insight"],
  };
  const groups = sectionGroups[project.slug];
  const tocItems = [
    { id: "overview", label: "Overview" },
    ...sections.map((s, i) => ({ id: s.id, label: s.title, group: groups?.[i] })),
  ];

  const h2: React.CSSProperties = { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111", margin: "0 0 14px" };

  return (
    <div className="project-detail-page" style={{ background: "#fff", minHeight: "100vh" }}>
      <TocNav items={tocItems} />
      <ReadingProgress />
      <ClapAFloat slug={`${project.slug}#detail`} />

      <div className="project-detail-container" style={{ maxWidth: "808px", margin: "0 auto", padding: "0 24px" }}>
        <ReferenceBadge id="detail-final" />
        <article style={{ padding: "40px 0 80px" }}>
          <div style={{ marginBottom: "24px" }}>
            <Link href="/preview/public/b" style={{ fontSize: "13px", color: "#aaa", letterSpacing: "-0.02em" }}>← Projects</Link>
          </div>

          {/* Eyebrow: 컬렉션 · 카테고리 · 기간 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px", fontSize: "11px", fontWeight: 600, letterSpacing: "-0.01em" }}>
            {collection && (
              <>
                <Link href="/preview/public/b" style={{ color: collection.color }}>{collection.title}</Link>
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
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, letterSpacing: "-0.025em", margin: "0 0 28px" }}>
            {project.desc}
          </p>

          <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/8", background: hero ? "#eee" : gradientMap[project.catClass], marginBottom: "36px" }}>
            {hero && <img src={hero} alt={stripTitleBreaks(project.title)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>

          <h2 style={h2}>주요 성과</h2>
          <ul style={{ margin: "0 0 32px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            {project.outcomes.map((o, i) => (
              <li key={i} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#555", lineHeight: 1.7, letterSpacing: "-0.025em" }}>
                <span style={{ color: "#bbb", fontSize: "10px", marginTop: "4px" }}>•</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>

          <h2 style={h2}>핵심 인사이트</h2>
          <blockquote style={{ margin: "0 0 36px", padding: "18px 22px", borderLeft: "3px solid #111", background: "#fafafa", fontSize: "14px", color: "#444", lineHeight: 1.8, letterSpacing: "-0.025em" }}>
            {renderWithHighlights(project.insight, project.insightHighlights)}
          </blockquote>

          {/* Skills & Tools — 컴팩트 */}
          <div className="pv-detail-meta">
            <div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "#ccc", fontWeight: 600, marginBottom: "10px" }}>Skills used</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "-0.02em", padding: "4px 11px", borderRadius: "20px", background: "#f2f2f2", color: "#555" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", color: "#ccc", fontWeight: 600, marginBottom: "10px" }}>Tools &amp; Stack</div>
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

          {/* 시안 전용: Clap 로그 패널이 여기로 들어온다 */}
          <div id="pv-log-slot" style={{ marginTop: "56px" }} />
        </article>
      </div>
    </div>
  );
}
