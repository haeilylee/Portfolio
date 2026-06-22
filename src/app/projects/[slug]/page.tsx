import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import TocNav from "@/components/toc-nav";

const gradientMap: Record<string, string> = {
  "design-system": "linear-gradient(145deg, #1a4fd6 0%, #4f86f7 100%)",
  ai: "linear-gradient(145deg, #5b21b6 0%, #a78bfa 100%)",
  ux: "linear-gradient(145deg, #065f46 0%, #34d399 100%)",
};

const categoryColor: Record<string, { bg: string; color: string }> = {
  "Design System": { bg: "rgba(59,108,244,0.10)", color: "#2d5cd8" },
  AI:              { bg: "rgba(123,63,228,0.10)", color: "#7031d4" },
  "UX Research":   { bg: "rgba(26,167,94,0.10)",  color: "#168f52" },
};

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

const sections = [
  { id: "overview", label: "Overview" },
  { id: "background", label: "배경" },
  { id: "problem", label: "문제" },
  { id: "process", label: "해결 과정" },
  { id: "result", label: "결과" },
];

const contentBySlug: Record<
  string,
  { background: string; problem: string; process: string; result: string }
> = {
  sdui: {
    background:
      "서버 드리븐 UI(SDUI) 아키텍처로의 전환이 결정되면서, 기존 컴포넌트 체계가 새로운 패러다임에 맞지 않는 문제가 발생했습니다. 개발팀과 디자인팀 모두 SDUI에서 컴포넌트가 어떤 단위로 존재해야 하는지에 대한 공통 이해가 부족한 상태였어요.",
    problem:
      "컴포넌트 명세가 Figma 파일, Confluence, Slack 메시지 등 여러 곳에 분산되어 있었고, 서로 다른 버전이 공존하면서 개발팀이 어느 기준을 따라야 하는지 알 수 없는 상황이었습니다. SDUI 전환에서는 컴포넌트 재사용성이 핵심인데, 재사용 가능한 컴포넌트 비율이 68%에 불과했어요.",
    process:
      "먼저 개발팀과 디자인팀이 함께 참여하는 워크숍을 통해 SDUI 맥락에서 '컴포넌트'의 정의를 재합의했습니다. 이후 Figma를 단일 소스 오브 트루스로 삼아 모든 컴포넌트 명세를 이전하고, Storybook과 연동해 개발자도 실시간으로 컴포넌트 상태를 확인할 수 있는 체계를 구축했어요.",
    result:
      "컴포넌트 명세 문서화로 개발-디자인 간 싱크 시간이 40% 단축됐고, 재사용 가능한 컴포넌트 비율이 68%에서 91%로 향상됐어요. 신규 팀원 온보딩 시간도 평균 3일에서 1일로 줄었습니다.",
  },
  "ai-requirements": {
    background:
      "기획자들은 새로운 기능이 논의될 때마다 동일한 구조의 요구사항 정의서를 반복적으로 작성해야 했습니다. 이 작업은 창의적 판단이 필요하지 않은 반복 업무임에도 매번 평균 4시간 이상이 소요되었고, 이는 실질적인 기획 업무 시간을 크게 줄이는 원인이었어요.",
    problem:
      "수동 작성 방식의 문제는 단순한 시간 낭비에 그치지 않았습니다. 작성자마다 양식이 달라 일관성이 부족했고, 누락 항목이 발생하면 개발 착수 후에야 발견되어 재작업으로 이어지는 경우가 많았어요.",
    process:
      "GitHub PR이 생성될 때 자동으로 트리거되는 Actions 워크플로우를 구성했습니다. PR의 변경 내용을 분석해 Claude API로 요구사항 초안을 생성하고, 표준화된 Markdown 양식으로 포맷팅한 뒤 PR 코멘트로 자동 첨부되도록 파이프라인을 설계했어요.",
    result:
      "요구사항 정의서 작성 시간이 80% 단축됐고, 문서 형식 표준화로 리뷰 효율이 크게 향상됐습니다. AI 파이프라인은 재사용 가능한 모듈로 구성되어 다른 프로젝트에도 적용할 수 있게 됐어요.",
  },
  "data-ux": {
    background:
      "데이터 통화 조회 서비스의 월간 활성 사용자 수는 꾸준히 증가하고 있었지만, 조회 시작 후 완료까지 이어지는 비율이 57%에 그쳤습니다. 이탈이 어느 단계에서, 왜 발생하는지 명확히 파악되지 않은 상황에서 개선 작업을 시작해야 했어요.",
    problem:
      "히트맵 데이터만 보면 이탈 지점의 위치는 파악할 수 있었지만, 왜 이탈하는지에 대한 답을 얻을 수 없었습니다. 정보 구조가 복잡해 사용자가 원하는 데이터를 찾는 데 어려움을 겪는다는 가설이 있었으나, 이를 검증할 정성적 데이터가 부족했어요.",
    process:
      "Hotjar 히트맵과 세션 녹화 데이터로 주요 이탈 지점을 특정한 뒤, 해당 지점의 사용자 6명을 대상으로 심층 인터뷰를 진행했습니다. 인터뷰 결과와 히트맵 데이터를 교차 분석해 5가지 핵심 불편 지점을 도출하고, 개선안의 유효성을 Figma 프로토타입으로 검증했어요.",
    result:
      "조회 완료율이 유의미하게 향상됐고, 핵심 불편 지점 3개가 해소됐습니다. 정보 계층 구조를 재편해 뎁스가 감소하고 사용자가 원하는 정보를 더 빠르게 찾을 수 있게 됐어요.",
  },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const catColor = categoryColor[project.category] ?? { bg: "#f0f0f0", color: "#666" };
  const content = contentBySlug[slug] ?? { background: "", problem: "", process: "", result: "" };

  return (
    <>
      <TocNav items={sections} />

      {/* White article card */}
      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "0 40px 0 40px",
          paddingRight: "200px",
        }}
      >
        {/* Inner white surface */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #e8e8e8",
            overflow: "hidden",
            marginTop: "24px",
            marginBottom: "40px",
          }}
        >
          {/* Thumbnail banner — top of card */}
          <div
            style={{
              width: "100%",
              aspectRatio: "16/7",
              background: gradientMap[project.catClass] ?? "#ccc",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-60px",
                right: "-60px",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-80px",
                left: "60px",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "rgba(255,255,255,0.22)",
                fontSize: "52px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {project.title}
            </div>
          </div>

          {/* Article body */}
          <div style={{ padding: "32px 36px 40px" }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: "20px" }}>
              <Link
                href="/"
                style={{
                  fontSize: "12px",
                  color: "#888",
                  letterSpacing: "-0.02em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ← Projects
              </Link>
            </div>

            {/* Category badge */}
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                padding: "3px 9px",
                borderRadius: "20px",
                background: catColor.bg,
                color: catColor.color,
                marginBottom: "12px",
              }}
            >
              {project.category}
            </span>

            {/* Title */}
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                color: "#111",
                margin: "0 0 12px",
                lineHeight: 1.25,
              }}
            >
              {project.title}
            </h1>

            {/* Date + desc */}
            <p style={{ fontSize: "13px", color: "#888", letterSpacing: "-0.02em", margin: "0 0 6px" }}>
              {project.date}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                letterSpacing: "-0.025em",
                lineHeight: 1.7,
                margin: "0 0 28px",
                maxWidth: "560px",
              }}
            >
              {project.desc}
            </p>

            {/* Skills used */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#aaa",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
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
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: "#f0f0f0",
                      color: "#444",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "0 0 28px" }} />

            {/* Overview + Outcomes */}
            <div id="overview" style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "36px", marginBottom: "36px" }}>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111", margin: "0 0 10px" }}>
                  Overview
                </h2>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.75, letterSpacing: "-0.025em", margin: 0 }}>
                  {project.desc}
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111", margin: "0 0 10px" }}>
                  주요 성과
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {project.outcomes.map((o, i) => (
                    <li key={i} style={{ display: "flex", gap: "7px", fontSize: "13px", color: "#444", lineHeight: 1.6, letterSpacing: "-0.02em" }}>
                      <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tools & Stack */}
            <div style={{ borderTop: "1px solid #ebebeb", paddingTop: "28px", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111", margin: "0 0 16px" }}>
                Tools &amp; Stack
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {project.tools.map((tool) => (
                  <div key={tool.name} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "12px", alignItems: "baseline" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", letterSpacing: "-0.03em" }}>{tool.name}</span>
                    <span style={{ fontSize: "13px", color: "#888", letterSpacing: "-0.02em" }}>{tool.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight box */}
            <div
              style={{
                background: "#f8f8f8",
                border: "1px solid #ebebeb",
                borderRadius: "10px",
                padding: "18px 22px",
                marginBottom: "36px",
              }}
            >
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#aaa", fontWeight: 600, marginBottom: "8px" }}>
                핵심 인사이트
              </div>
              <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.75, letterSpacing: "-0.025em", margin: 0 }}>
                {project.insight}
              </p>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "0 0 36px" }} />

            {/* Content sections */}
            {[
              { id: "background", title: "배경", text: content.background },
              { id: "problem",    title: "문제",  text: content.problem },
              { id: "process",    title: "해결 과정", text: content.process },
              { id: "result",     title: "결과",  text: content.result },
            ].map((s) => (
              <section key={s.id} id={s.id} style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.04em", color: "#111", margin: "0 0 10px" }}>
                  {s.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.8, letterSpacing: "-0.025em", margin: 0 }}>
                  {s.text}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
