"use client";

type TocItem = { id: string; label: string };

export default function TocNav({ items }: { items: TocItem[] }) {
  return (
    <div
      style={{
        position: "fixed",
        right: "28px",
        top: "calc(var(--nav-h) + 36px)",
        width: "152px",
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#bbb",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        On This Page
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              fontSize: "12px",
              color: "#999",
              letterSpacing: "-0.02em",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "block",
              transition: "color 0.12s, background 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#111";
              (e.currentTarget as HTMLAnchorElement).style.background = "#ebebeb";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#999";
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
