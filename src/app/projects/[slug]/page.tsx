import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import TocNav from "@/components/toc-nav";

const gradientMap: Record<string, string> = {
  "design-system": "linear-gradient(145deg, #1a4fd6, #4f86f7)",
  ai: "linear-gradient(145deg, #5b21b6, #a78bfa)",
  ux: "linear-gradient(145deg, #065f46, #34d399)",
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
  return { title: project ? project.title : "Not Found" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <TocNav />

      {/* Main article */}
      <article
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "32px 40px 80px",
          paddingRight: "220px",
        }}
      >
        {/* Breadcrumb */}
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "var(--tx-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              letterSpacing: "-0.02em",
            }}
          >
            ← Projects
          </Link>
        </div>

        {/* Article header */}
        <header
          style={{
            textAlign: "center",
            paddingBottom: "0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              color: "var(--tx-3)",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            <span>{project.date}</span>
            <span>|</span>
            <span>{project.category}</span>
          </div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "var(--tx-1)",
              margin: "0 0 14px",
              lineHeight: 1.25,
            }}
          >
            {project.title}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--tx-3)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {project.desc}
          </p>
        </header>

        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16/7",
            background: gradientMap[project.catClass] ?? "#ccc",
            borderRadius: "12px",
            overflow: "hidden",
            margin: "24px 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "rgba(255,255,255,0.25)",
              fontSize: "48px",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            {project.category}
          </div>
        </div>

        {/* Two-column section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: "40px",
            borderTop: "1px solid #e8e8e8",
            paddingTop: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Left column */}
          <div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--tx-2)",
                lineHeight: 1.75,
                margin: "0 0 20px",
              }}
            >
              {project.desc}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "13px",
                color: "var(--tx-3)",
                marginBottom: "14px",
                flexWrap: "wrap",
              }}
            >
              <span>📅 {project.date}</span>
              <span>🏷 {project.tags.join(", ")}</span>
            </div>
            {/* Tag chips */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "12px",
                    padding: "3px 9px",
                    borderRadius: "20px",
                    background: "#ededed",
                    color: "var(--tx-2)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right column: outcomes */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--tx-1)",
                margin: "0 0 12px",
              }}
            >
              주요 성과
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {project.outcomes.map((outcome, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "13px",
                    color: "var(--tx-2)",
                    lineHeight: 1.6,
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#22c55e", flexShrink: 0, fontWeight: 600 }}>✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tools & Stack */}
        <div
          style={{
            borderTop: "1px solid #e8e8e8",
            paddingTop: "24px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: "var(--tx-1)",
              margin: "0 0 16px",
            }}
          >
            Tools &amp; Stack
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {project.tools.map((tool) => (
              <div
                key={tool.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "12px",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--tx-1)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {tool.name}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--tx-3)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insight box */}
        <div
          style={{
            background: "#f8f8f8",
            border: "1px solid #e8e8e8",
            borderRadius: "10px",
            padding: "20px 24px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--tx-3)",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            핵심 인사이트
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--tx-2)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {project.insight}
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e8e8e8",
            margin: "0 0 40px",
          }}
        />

        {/* Content sections */}
        <section id="background" style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "var(--tx-1)",
              margin: "0 0 12px",
            }}
          >
            배경
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--tx-2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {project.category === "Design System" &&
              "서버 드리븐 UI(SDUI) 아키텍처로의 전환이 결정되면서, 기존 컴포넌트 체계가 새로운 패러다임에 맞지 않는 문제가 발생했습니다. 개발팀과 디자인팀 모두 SDUI에서 컴포넌트가 어떤 단위로 존재해야 하는지에 대한 공통 이해가 부족한 상태였어요."}
            {project.category === "AI" &&
              "기획자들은 새로운 기능이 논의될 때마다 동일한 구조의 요구사항 정의서를 반복적으로 작성해야 했습니다. 이 작업은 창의적 판단이 필요하지 않은 반복 업무임에도 매번 평균 4시간 이상이 소요되었고, 이는 실질적인 기획 업무 시간을 크게 줄이는 원인이었어요."}
            {project.category === "UX Research" &&
              "데이터 통화 조회 서비스의 월간 활성 사용자 수는 꾸준히 증가하고 있었지만, 조회 시작 후 완료까지 이어지는 비율이 57%에 그쳤습니다. 이탈이 어느 단계에서, 왜 발생하는지 명확히 파악되지 않은 상황에서 개선 작업을 시작해야 했어요."}
          </p>
        </section>

        <section id="problem" style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "var(--tx-1)",
              margin: "0 0 12px",
            }}
          >
            문제
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--tx-2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {project.category === "Design System" &&
              "컴포넌트 명세가 Figma 파일, Confluence, Slack 메시지 등 여러 곳에 분산되어 있었고, 서로 다른 버전이 공존하면서 개발팀이 어느 기준을 따라야 하는지 알 수 없는 상황이었습니다. SDUI 전환에서는 컴포넌트 재사용성이 핵심인데, 재사용 가능한 컴포넌트 비율이 68%에 불과했어요."}
            {project.category === "AI" &&
              "수동 작성 방식의 문제는 단순한 시간 낭비에 그치지 않았습니다. 작성자마다 양식이 달라 일관성이 부족했고, 누락 항목이 발생하면 개발 착수 후에야 발견되어 재작업으로 이어지는 경우가 많았어요. 팀 전체의 생산성에 직접적인 영향을 주는 문제였습니다."}
            {project.category === "UX Research" &&
              "히트맵 데이터만 보면 이탈 지점의 위치는 파악할 수 있었지만, 왜 이탈하는지에 대한 답을 얻을 수 없었습니다. 정보 구조가 복잡해 사용자가 원하는 데이터를 찾는 데 어려움을 겪는다는 가설이 있었으나, 이를 검증할 정성적 데이터가 부족했어요."}
          </p>
        </section>

        <section id="process" style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "var(--tx-1)",
              margin: "0 0 12px",
            }}
          >
            해결 과정
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--tx-2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {project.category === "Design System" &&
              "먼저 개발팀과 디자인팀이 함께 참여하는 워크숍을 통해 SDUI 맥락에서 '컴포넌트'의 정의를 재합의했습니다. 이후 Figma를 단일 소스 오브 트루스로 삼아 모든 컴포넌트 명세를 이전하고, Storybook과 연동해 개발자도 실시간으로 컴포넌트 상태를 확인할 수 있는 체계를 구축했어요."}
            {project.category === "AI" &&
              "GitHub PR이 생성될 때 자동으로 트리거되는 Actions 워크플로우를 구성했습니다. PR의 변경 내용을 분석해 GPT-4o API로 요구사항 초안을 생성하고, 표준화된 Markdown 양식으로 포맷팅한 뒤 PR 코멘트로 자동 첨부되도록 파이프라인을 설계했어요."}
            {project.category === "UX Research" &&
              "Hotjar 히트맵과 세션 녹화 데이터로 주요 이탈 지점을 특정한 뒤, 해당 지점의 사용자 6명을 대상으로 심층 인터뷰를 진행했습니다. 인터뷰 결과와 히트맵 데이터를 교차 분석해 5가지 핵심 불편 지점을 도출하고, Maze를 활용한 A/B 프로토타입 테스트로 개선안의 유효성을 검증했어요."}
          </p>
        </section>

        <section id="result" style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "var(--tx-1)",
              margin: "0 0 12px",
            }}
          >
            결과
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--tx-2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {project.outcomes[0]} {project.outcomes[1]} {project.outcomes[2]}
          </p>
        </section>
      </article>
    </>
  );
}
