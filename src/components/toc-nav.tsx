"use client";

import React, { useEffect, useState } from "react";

type TocItem = { id: string; label: string; group?: string };

function renderItem(
  item: TocItem,
  active: string,
  scrollTo: (id: string) => void,
  inCluster = false
) {
  const isActive = active === item.id;
  return (
    <button
      key={item.id}
      onClick={() => scrollTo(item.id)}
      style={{
        all: "unset",
        display: "block",
        padding: inCluster ? "6px 8px" : "9px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        background: isActive ? (inCluster ? "#ffffff" : "#f2f2f2") : "transparent",
        boxShadow: isActive && inCluster ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
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
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#c0c0c0",
          fontWeight: 700,
          marginBottom: "14px",
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
              <div
                key={`group-${groupName}`}
                style={{
                  background: "#f5f6f8",
                  borderRadius: "10px",
                  padding: "8px 8px 9px",
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#b7b7bf",
                    fontWeight: 700,
                    padding: "2px 8px 5px",
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
