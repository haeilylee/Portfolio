"use client";

import React, { useEffect, useState } from "react";

type TocItem = { id: string; label: string; group?: string };

export default function TocNav({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="toc-nav"
      style={{
        width: "220px",
        flexShrink: 0,
        position: "sticky",
        top: "calc(var(--nav-h) + 48px)",
        alignSelf: "flex-start",
        paddingTop: "48px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#c0c0c0",
          fontWeight: 700,
          marginBottom: "14px",
          paddingLeft: "12px",
        }}
      >
        목차
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {items.map((item, i) => {
          const isActive = active === item.id;
          const prevGroup = i > 0 ? items[i - 1].group : undefined;
          const showGroupHeader = item.group && item.group !== prevGroup;
          return (
            <React.Fragment key={item.id}>
              {showGroupHeader && (
                <div
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#d5d5d5",
                    fontWeight: 700,
                    padding: i === 0 ? "0 12px 6px" : "16px 12px 6px",
                  }}
                >
                  {item.group}
                </div>
              )}
              <button
                onClick={() => scrollTo(item.id)}
                style={{
                  all: "unset",
                  display: "block",
                  padding: "9px 12px",
                  paddingLeft: item.group ? "20px" : "12px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  background: isActive ? "#f2f2f2" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.45,
                    color: isActive ? "#111" : "#aaa",
                    fontWeight: isActive ? 600 : 400,
                    transition: "color 0.15s",
                    wordBreak: "keep-all",
                    display: "block",
                  }}
                >
                  {item.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
