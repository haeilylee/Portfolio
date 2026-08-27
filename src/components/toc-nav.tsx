"use client";

import React, { useEffect, useState } from "react";

type TocItem = { id: string; label: string; group?: string };

function renderItem(
  item: TocItem,
  active: string,
  scrollTo: (id: string) => void,
  indented = false
) {
  const isActive = active === item.id;
  return (
    <button
      key={item.id}
      onClick={() => scrollTo(item.id)}
      style={{
        all: "unset",
        position: "relative",
        display: "block",
        padding: "6px 0 6px 12px",
        marginLeft: indented ? "14px" : 0,
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {isActive && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "4px",
            bottom: "4px",
            width: "2px",
            borderRadius: "2px",
            background: "#111",
          }}
        />
      )}
      <span
        style={{
          fontSize: "14px",
          letterSpacing: "-0.02em",
          lineHeight: 1.5,
          color: isActive ? "#111" : "#999",
          fontWeight: isActive ? 700 : 400,
          transition: "color 0.15s",
          wordBreak: "keep-all",
          display: "block",
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

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
        maxHeight: "calc(100vh - var(--nav-h) - 48px - 32px)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#bbb",
          fontWeight: 400,
          marginBottom: "16px",
          paddingLeft: "12px",
          flexShrink: 0,
        }}
      >
        목차
      </div>

      <nav
        className="toc-nav-scroll"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          overflowY: "auto",
          paddingBottom: "24px",
          minHeight: 0,
        }}
      >
        {(() => {
          const nodes: React.ReactNode[] = [];
          let i = 0;
          while (i < items.length) {
            const item = items[i];
            if (!item.group) {
              nodes.push(renderItem(item, active, scrollTo));
              i++;
              continue;
            }
            const groupName = item.group;
            const clusterItems: TocItem[] = [];
            while (i < items.length && items[i].group === groupName) {
              clusterItems.push(items[i]);
              i++;
            }
            nodes.push(
              <div key={`group-${groupName}`} style={{ marginTop: "10px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#111",
                    padding: "6px 0 6px 12px",
                    wordBreak: "keep-all",
                  }}
                >
                  {groupName}
                </div>
                {clusterItems.map((clusterItem) => renderItem(clusterItem, active, scrollTo, true))}
              </div>
            );
          }
          return nodes;
        })()}
      </nav>
    </div>
  );
}
