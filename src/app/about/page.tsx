export default function AboutPage() {
  return (
    <div style={{ padding: "48px 40px", maxWidth: "640px" }}>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          letterSpacing: "-0.05em",
          color: "var(--tx-1)",
          margin: "0 0 16px",
        }}
      >
        About
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--tx-2)",
          lineHeight: 1.8,
          margin: "0 0 20px",
        }}
      >
        안녕하세요, 이하경입니다. 디자인 시스템, AI 자동화, UX 리서치를 통해 팀의 문제를 해결하는 Product Designer이자 PM으로 일하고 있습니다.
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--tx-2)",
          lineHeight: 1.8,
          margin: "0 0 20px",
        }}
      >
        디자인과 개발의 경계에서 양쪽 언어를 모두 이해하고, 팀 전체의 생산성을 높이는 도구와 체계를 만드는 데 관심이 있습니다.
      </p>
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "32px",
        }}
      >
        <a
          href="mailto:plus@plus-ex.com"
          style={{
            fontSize: "13px",
            color: "var(--tx-1)",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #e5e5e5",
            background: "#fff",
            letterSpacing: "-0.02em",
            textDecoration: "none",
          }}
        >
          이메일 보내기
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            color: "var(--tx-3)",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #e5e5e5",
            background: "#fff",
            letterSpacing: "-0.02em",
            textDecoration: "none",
          }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
