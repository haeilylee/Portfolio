"use client";

const tocItems = [
  { id: "background", label: "배경" },
  { id: "problem", label: "문제" },
  { id: "process", label: "해결 과정" },
  { id: "result", label: "결과" },
];

export default function TocNav() {
  return (
    <div
      style={{
        position: "fixed",
        right: "24px",
        top: "calc(var(--nav-h) + 32px)",
        width: "160px",
        zIndex: 30,
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
        On This Page
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              fontSize: "13px",
              color: "var(--tx-3)",
              letterSpacing: "-0.02em",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "block",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--tx-1)";
              (e.currentTarget as HTMLAnchorElement).style.background = "#ebebeb";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--tx-3)";
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
