"use client";

import { useState } from "react";

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#ccc",
  fontWeight: 600,
};

export function CollapsibleSection({
  id,
  label,
  defaultOpen = true,
  children,
  style,
}: {
  id?: string;
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} style={style}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          marginBottom: open ? "16px" : 0,
          width: "100%",
          textAlign: "left",
        }}
      >
        <span style={labelStyle}>{label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s ease",
            marginTop: "1px",
            flexShrink: 0,
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "9999px" : "0px",
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {children}
      </div>
    </section>
  );
}
