import type { Project } from "@/lib/projects";
import { gradientMap, categoryColor } from "@/lib/category-styles";
import { renderTitle, stripTitleBreaks } from "@/lib/format-title";

/**
 * 리액션 시안을 올려 둘 "프로젝트 상세 페이지" 축약판.
 * 실제 상세 페이지의 타이포·간격을 따라가되, 리액션 위치만 비교하면 되므로 본문은 줄였다.
 */
export default function ArticleFrame({
  project,
  children,
  afterBody,
}: {
  project: Project;
  /** 본문 안/옆에 띄울 요소 (플로팅 버튼 등) */
  children?: React.ReactNode;
  /** 본문 끝에 붙는 요소 (리액션 바, 댓글) */
  afterBody?: React.ReactNode;
}) {
  const hero = project.heroThumbnail ?? project.thumbnail;
  return (
    <article style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px 0", position: "relative" }}>
      {children}

      <div style={{ fontSize: "11px", fontWeight: 600, color: categoryColor[project.category] ?? "#888", marginBottom: "12px" }}>
        {project.category} · {project.date}
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

      <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111", margin: "0 0 14px" }}>주요 성과</h2>
      <ul style={{ margin: "0 0 32px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
        {project.outcomes.map((o, i) => (
          <li key={i} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#555", lineHeight: 1.7, letterSpacing: "-0.025em" }}>
            <span style={{ color: "#bbb", fontSize: "10px", marginTop: "4px" }}>•</span>
            <span>{o}</span>
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111", margin: "0 0 14px" }}>핵심 인사이트</h2>
      <blockquote style={{ margin: "0 0 40px", padding: "18px 22px", borderLeft: "3px solid #111", background: "#fafafa", fontSize: "14px", color: "#444", lineHeight: 1.8, letterSpacing: "-0.025em" }}>
        {project.insight}
      </blockquote>

      {afterBody}
      <div style={{ height: "80px" }} />
    </article>
  );
}
